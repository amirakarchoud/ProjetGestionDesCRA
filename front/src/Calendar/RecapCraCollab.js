import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TodayIcon from '@mui/icons-material/Today';
import { toast } from 'react-toastify';

const RecapCraCollab = ({ collabId }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [businessDays, setBusinessDays] = useState(0);
    const [userCras, setUserCras] = useState([]);
    const apiUrl = 'http://localhost:3000';
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [etat, setEtat] = useState('');
    const [etatChangeTrigger, setEtatChangeTrigger] = useState(0);

    useEffect(() => {
        fetchData();
    }, [etatChangeTrigger]);
    useEffect(() => {
        if (userCras.length > 0) {
            calculateBusinessDays(currentDate.getMonth() + 1, currentDate.getFullYear());
            setIsSubmitButtonDisabled(() => {
                const currentMonthCra = getCurrentMonthCra();
                if (Object.keys(currentMonthCra).length === 0) {
                    return true;
                }
                return (currentMonthCra._activites.length + currentMonthCra._absences.length) / 2 !== businessDays - currentMonthCra._holidays.length;
            });
        }
    }, [userCras, businessDays, currentDate]);


    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl + '/cra/userYear/' + collabId + '/2023', { mode: 'cors' });
            const data = await response.json();
            console.log("getting cras in recap")
            setUserCras(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (userCras.length > 0) {
          calculateBusinessDays(currentDate.getMonth() + 1, currentDate.getFullYear());
    
          const currentMonthCra = getCurrentMonthCra();
    
          if (Object.keys(currentMonthCra).length === 0) {
            setEtat('Pas cree'); // If CRA doesn't exist, set etat to 'Pas cree'
          } else {
            setIsSubmitButtonDisabled(() => {
              return (
                (currentMonthCra._activites.length + currentMonthCra._absences.length) / 2 !==
                businessDays - currentMonthCra._holidays.length
              );
            });
            setEtat(currentMonthCra._etat ? 'Pas Soumis' : 'Soumis'); 
          }
        }
      }, [userCras, businessDays, currentDate]);

    const handleCraSubmit = async () => {
        try {
            const currentMonthCra = getCurrentMonthCra();
            if ((currentMonthCra._activites.length + currentMonthCra._absences.length) / 2 === businessDays - currentMonthCra._holidays.length) {

                const response = await fetch(`${apiUrl}/cra/submit/${currentMonthCra._id}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    toast.success('CRA submitted successfully.');
                    setEtatChangeTrigger((prevState) => prevState + 1);
                } else {
                    toast.error('Error submitting CRA.');
                }
            } else {
                toast.warning('Cannot submit CRA. Please make sure all data is filled.');
            }
        } catch (error) {
            console.error('Error submitting CRA:', error);
            toast.error('Error submitting CRA.');
        }
    };



    const calculateBusinessDays = (month, year) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        let i = 0;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                i++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setBusinessDays(i);
    };

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurrentDate(nextMonth);
    };

    const frenchMonthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];

 
  const paperStyle = {
    backgroundColor: '',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '16px',
  };

  const pasSoumisStyle = {
    ...paperStyle,
    backgroundColor: '#E8F4FD', 
  };

  const soumisStyle = {
    ...paperStyle,
    backgroundColor: '#CFFFCF', 
  };

  const pasCreeStyle = {
    ...paperStyle,
    backgroundColor: '#FFD9D9', 
  };

  const getPaperStyle = () => {
    switch (etat) {
      case 'Pas Soumis':
        return pasSoumisStyle;
      case 'Soumis':
        return soumisStyle;
      case 'Pas cree':
        return pasCreeStyle;
      default:
        return paperStyle;
    }
  };

    const getCurrentMonthCra = () => {
        const currentMonth = currentDate.getMonth() + 1;
        return userCras.find(cra => cra._month === currentMonth) || {};
    };

    const handleCurrentMonth = () => {
        const currentMonth = new Date().getMonth() + 1;
        setCurrentDate(new Date(currentDate.getFullYear(), currentMonth - 1, 1));
    };


    return (
        <Paper sx={getPaperStyle()}>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="16px">
                <IconButton onClick={handlePrevMonth} size="large" edge="start" color="inherit" aria-label="prev">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="h2" style={{ marginLeft: '8px', marginRight: '8px' }}>
                    Recap du mois : {frenchMonthNames[currentDate.getMonth()]}
                </Typography>
                <IconButton onClick={handleNextMonth} size="large" edge="end" color="inherit" aria-label="next">
                    <ArrowForwardIcon />
                </IconButton>
                <IconButton onClick={handleCurrentMonth} size="large" color="inherit" aria-label="current">
                    <TodayIcon />
                </IconButton>
            </Box>
            <Typography>
                {userCras && userCras.length > 0 && (
                    <>
                        <strong>Les jours travailles: </strong>
                        {getCurrentMonthCra()._activites ? getCurrentMonthCra()._activites.length / 2 : 0}
                        <br />
                        <strong>Nombres d'absences: </strong>
                        {getCurrentMonthCra()._absences ? getCurrentMonthCra()._absences.length / 2 : 0}
                        <br />
                        <strong>Nombre des jours vides: </strong>
                        {getCurrentMonthCra()._activites && getCurrentMonthCra()._absences
                            ? (businessDays - getCurrentMonthCra()._holidays.length) - ((getCurrentMonthCra()._activites.length + getCurrentMonthCra()._absences.length) / 2)
                            : businessDays}
                        <br />

                        <strong>Total: </strong>
                        {getCurrentMonthCra()._activites && getCurrentMonthCra()._absences
                            ? (getCurrentMonthCra()._activites.length + getCurrentMonthCra()._absences.length) / 2
                            : 0} / {businessDays - (getCurrentMonthCra()._holidays ? getCurrentMonthCra()._holidays.length : 0)}

                        <br />

                        <strong>Etat: </strong>
                        {etat}
                        <br />
                    </>
                )}
            </Typography>
            <br />
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmitButtonDisabled}
                onClick={handleCraSubmit}
            >
                Submit
            </Button>

        </Paper>
    );
};

export default RecapCraCollab;

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DetailsCard from './Details'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const localizer = momentLocalizer(moment);
const apiUrl = 'http://localhost:3000';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOption, setSelectedOption] = useState('activity');
  const [selectedAbsenceOption, setSelectedAbsenceOption] = useState('full-day'); 
  const [selectedAmPm, setSelectedAmPm] = useState('am'); 
  const [selectedReason, setSelectedReason] = useState('');
  const [userProjects, setUserProjects] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [showCard, setShowCard] = useState(false); 


  const user = 'user2';

  const raisonOptions = [
    { value: 'rtt', label: 'RTT' },
    { value: 'conges', label: 'Congés' },
    { value: 'maladie', label: 'Maladie' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + '/cra/userYear/' + user + '/2023', { mode: 'cors' });
        const data = await response.json();
        const processedEvents = processData(data);
        setEvents(processedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const fetchUserProjects = async () => {
      try {
        const response = await fetch(apiUrl + '/project/user/' + user);
        const data = await response.json();
        setUserProjects(data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    };

    fetchUserProjects();
  }, []);

  const processData = (data) => {
    const processedEvents = [];

    data.forEach((entry) => {
      // Process activities
      entry._activites.forEach((activity) => {
        const formattedDate = moment(activity.date).format('YYYY-MM-DD');
        const event = {
          id: activity._id,
          title: 'activity',
          start: new Date(formattedDate),
          end: new Date(formattedDate),
        };

        processedEvents.push(event);
      });

      // Process absences
      entry._absences.forEach((absence) => {
        const formattedDate = moment(absence.date).format('YYYY-MM-DD');
        const event = {
          id: absence.id,
          title: absence.raison,
          start: new Date(formattedDate),
          end: new Date(formattedDate),
        };

        processedEvents.push(event);
      });
    });

    return processedEvents;
  };

  const handleSelectSlot = ({ slots }) => {
    let start = null;
    let end = null;

    if (slots.length > 1) {
      start = moment(slots[0]).toDate();
      end = moment(slots[slots.length - 1]).toDate();
    } else if (slots.length === 1) {
      start = moment(slots[0]).toDate();
      end = moment(slots[0]).toDate();
    }

    setSelectedRange({ start, end });
    setShowConfirmation(true);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedReason('');
    setSelectedAbsenceOption('full-day');
    setSelectedAmPm('am');
  };

  const handleAbsenceOptionChange = (event) => {
    setSelectedAbsenceOption(event.target.value);
    setSelectedAmPm('am');
  };

  const handleAmPmChange = (event) => {
    setSelectedAmPm(event.target.value);
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };
  const handleCancel = () => {
    setSelectedRange(null);
    setShowConfirmation(false);
  };

  const handleConfirm = async () => {
    const matin = selectedAbsenceOption === 'half-day' ? (selectedAmPm === 'am' ? true : false) : true; 

    const dateRange = [];
    let currentDate = moment(selectedRange.start);
    const endDate = moment(selectedRange.end);
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toDate());
      currentDate = currentDate.clone().add(1, 'day');
    }

    for (const date of dateRange) {
      console.log('creating');
      if (selectedOption === 'activity') {
        const createActivityDto = {
          date,
          matin,
          collabId: user,
          projectId: selectedReason,
          craId: 0,
        };

        try {
          const response = await fetch(apiUrl + '/cra/activity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createActivityDto),
          });
          const data = await response.json();
          console.log('Added activity:', data);
        } catch (error) {
          console.error('Error adding activity:', error);
        }
      } else if (selectedOption === 'absence') {
        const createAbsenceDto = {
          date,
          matin,
          collabId: user,
          raison: selectedReason,
          craId: 0,
        };

        try {
          const response = await fetch(apiUrl + '/cra/absence', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createAbsenceDto),
          });
          const data = await response.json();
          console.log('Added absence:', data);
        } catch (error) {
          console.error('Error adding absence:', error);
        }
      }

      if (selectedAbsenceOption === 'full-day') {
        const secondMatinValue = !matin;
        console.log("matin value before= "+matin);
        console.log("full day , matin value here= "+secondMatinValue);

        if (selectedOption === 'activity') {
          const createActivityDto = {
            date,
            matin: secondMatinValue,
            collabId: user,
            projectId: selectedReason,
            craId: 0,
          };

          try {
            const response = await fetch(apiUrl + '/cra/activity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(createActivityDto),
            });
            const data = await response.json();
            console.log('Added activity:', data);
          } catch (error) {
            console.error('Error adding activity:', error);
          }
        } else if (selectedOption === 'absence') {
          const createAbsenceDto = {
            date,
            matin: secondMatinValue,
            collabId: user,
            raison: selectedReason,
            craId: 0,
          };

          try {
            const response = await fetch(apiUrl + '/cra/absence', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(createAbsenceDto),
            });
            const data = await response.json();
            console.log('Added absence:', data);
          } catch (error) {
            console.error('Error adding absence:', error);
          }
        }
      }
    }

    setSelectedRange(null);
    setShowConfirmation(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <div style={{ height: '700px', width: '750px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent} 
            style={{ flex: 1 }}
          />
        </div>
        <Modal
          open={showConfirmation}
          onClose={handleCancel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Selection des dates
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Etes-vous sûr des dates sélectionnées?<br />

              Les dates: {selectedRange && selectedRange.start?.toDateString()} au{' '}
              {selectedRange && selectedRange.end?.toDateString()}
              <br />
              <RadioGroup aria-label="activity-absence" name="activity-absence" value={selectedOption} onChange={handleOptionChange}>
                <FormControlLabel value="activity" control={<Radio />} label="Activité" />
                <FormControlLabel value="absence" control={<Radio />} label="Absence" />
              </RadioGroup>

              <div>
                <RadioGroup aria-label="half-full-day" name="half-full-day" value={selectedAbsenceOption} onChange={handleAbsenceOptionChange}>
                  <FormControlLabel value="half-day" control={<Radio />} label="Demi Journée" />
                  <FormControlLabel value="full-day" control={<Radio />} label="Journée" />
                </RadioGroup>
                {selectedAbsenceOption === 'half-day' && (
                  <RadioGroup aria-label="am-pm" name="am-pm" value={selectedAmPm} onChange={handleAmPmChange}>
                    <FormControlLabel value="am" control={<Radio />} label="Matin" />
                    <FormControlLabel value="pm" control={<Radio />} label="Après-midi" />
                  </RadioGroup>
                )}
              </div>

              <Select
                value={selectedReason}
                onChange={handleReasonChange}
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="" disabled>
                  {selectedOption === 'activity' ? 'Projet' : 'Raison'}
                </MenuItem>
                {selectedOption === 'activity'
                  ? userProjects.map((project) => (
                    <MenuItem key={project.code} value={project.code}>
                      {project.code}
                    </MenuItem>
                  ))
                  : (
                    raisonOptions.map((raison) => (
                      <MenuItem key={raison.value} value={raison.value}>
                        {raison.label}
                      </MenuItem>
                    ))
                  )}
              </Select>

            </Typography>
            <Button onClick={handleConfirm}>Confirm</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>
        </Modal>
        {showCard && selectedEvent && (
          <div style={{ position: 'absolute', top: 100, right: 10 }}>
            <DetailsCard event={selectedEvent} onClose={handleCloseCard} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;

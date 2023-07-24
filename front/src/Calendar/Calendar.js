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
import ConfirmationModal from './ConfirmationDelete'
import { toast } from 'react-toastify';
import './custom-calendar.css';
import RecapCraCollab from './RecapCraCollab';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#E8F4FD',
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
  const [userCras, setUserCras] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const [recapCraKey, setRecapCraKey] = useState(0); 

  const formattedStartDate = selectedRange && selectedRange.start ? selectedRange.start.toDateString() : '';
  const formattedEndDate = selectedRange && selectedRange.end ? selectedRange.end.toDateString() : '';


  const user = 'user2';

  const raisonOptions = [
    { value: 'RTT', label: 'RTT' },
    { value: 'Conges', label: 'Congés' },
    { value: 'Maladie', label: 'Maladie' },
    { value: 'Exceptionnel', label: 'Exceptionnelle' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + '/cra/userYear/' + user + '/2023', { mode: 'cors' });
        const data = await response.json();
        setUserCras(data);
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

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl + '/cra/userYear/' + user + '/2023', { mode: 'cors' });
      const data = await response.json();
      setUserCras(data);
      const processedEvents = processData(data);
      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    const processedEvents = [];

    data.forEach((entry) => {
      // Process activities
      entry._activites.forEach((activity) => {
        const formattedDate = moment(activity.date).format('YYYY-MM-DD');
        const event = {
          id: activity.id,
          type: 'Activity',
          cra: entry._id,
          matin: activity.matin,
          title: activity.project.code,
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
          type: 'Absence',
          title: absence.raison,
          cra: entry._id,
          matin: absence.matin,
          start: new Date(formattedDate),
          end: new Date(formattedDate),
        };

        processedEvents.push(event);
      });


      // Process holidays
      entry._holidays.forEach((holiday) => {
        const formattedDate = moment(holiday._date).format('YYYY-MM-DD');
        const startOfDay = moment(formattedDate).startOf('day').toDate();
        const endOfDay = moment(formattedDate).endOf('day').toDate();

        const event = {
          id: holiday._id,
          type: 'Holiday',
          cra: entry._id,
          title: holiday._name,
          start: startOfDay,
          end: endOfDay,
        };

        processedEvents.push(event);
      });

    });


    return processedEvents;
  };

  const eventStyleGetter = (event) => {
    if (event.type === 'Activity') {
      return {
        className: 'rbc-event-activity',
      };
    } else if (event.type === 'Absence') {
      return {
        className: 'rbc-event-absence',
      };
    } else if (event.type === 'Holiday') {
      return {
        className: 'rbc-event-holiday',
      };
    }
    return {};
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
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        dateRange.push(currentDate.toDate());
      }
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

          if (response.ok) {
            toast.success('Activite ajoutee avec succes!');
            fetchData();
          } else {
            const errorData = await response.json();
            console.error('Error adding activity:', errorData);
            if (errorData.message) {
              toast.error(errorData.message);
            } else {
              toast.error('Failed to add activity');
            }
          }
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
          if (response.ok) {
            toast.success('Absence ajoutee avec succes!');
            fetchData();
          } else {
            const errorData = await response.json();
            console.error('Error adding absence:', errorData);
            if (errorData.message) {
              toast.error(errorData.message);
            } else {
              toast.error('Failed to add absence');
            }
          }
        } catch (error) {
          console.error('Error adding absence:', error);
        }
      }

      if (selectedAbsenceOption === 'full-day') {
        const secondMatinValue = !matin;
        console.log("matin value before= " + matin);
        console.log("full day , matin value here= " + secondMatinValue);

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
    fetchData();
    setSelectedRange(null);
    setShowConfirmation(false);
    setRecapCraKey(prevKey => prevKey + 1);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handleDelete = async () => {
    try {
      setShowConfirmationDelete(true);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedEvent.type === 'Activity') {
        const deleteActivityDto = {
          id: selectedEvent.cra,
          date: selectedEvent.start,
          matin: selectedEvent.matin,
        };

        const response = await fetch(`${apiUrl}/cra/activity`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteActivityDto),
        });

        if (response.ok) {
          const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
          setEvents([...updatedEvents]);

          toast.success('Activity successfully deleted!');

        } else {
          toast.error('Failed to delete activity');
        }
      } else if (selectedEvent.type === 'Absence') {
        const deleteAbsenceDto = {
          id: selectedEvent.cra,
          date: selectedEvent.start,
          matin: selectedEvent.matin,
        };

        const response = await fetch(`${apiUrl}/cra/absence`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteAbsenceDto),
        });

        if (response.ok) {
          const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
          setEvents([...updatedEvents]);
          toast.success('Absence successfully deleted!');

        } else {
          toast.error('Failed to delete absence');
        }
      }

      setShowConfirmationDelete(false);
      setSelectedEvent(null);
      setRecapCraKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleCloseConfirmationModal = () => {
    // setSelectedEventToDelete(null);
    setShowConfirmationDelete(false);
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
            eventPropGetter={eventStyleGetter}
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

              <strong> Les dates: </strong>{selectedRange && selectedRange.start && (
                <>
                  {formattedStartDate}
                  {selectedRange.end && formattedStartDate !== formattedEndDate && ` au ${formattedEndDate}`}
                </>
              )}
              <br />
              <RadioGroup aria-label="activity-absence" name="activity-absence" value={selectedOption} onChange={handleOptionChange}>
                <FormControlLabel value="activity" control={<Radio />} label="Activité" />
                <FormControlLabel value="absence" control={<Radio />} label="Absence" />
              </RadioGroup>

              <div>
                <strong>Journée ou demie journee:</strong>
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
          <div style={{ position: 'absolute', top: '15%', right: '10%', width: '30%' }}>
            <DetailsCard event={selectedEvent} onClose={handleCloseCard} onDelete={handleDelete} />
          </div>
        )}
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '30%' }}>
        <RecapCraCollab key={recapCraKey} collabId={user} cras={userCras} />
        </div >
        <ConfirmationModal
          open={showConfirmationDelete}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmDelete}
        />
        
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;

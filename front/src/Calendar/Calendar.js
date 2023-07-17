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
  const [selectedReason, setSelectedReason] = useState('');
  const [userProjects, setUserProjects] = useState([]);

  const user = 'user2';

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
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleConfirm = () => {
    console.log('Confirmed range:', selectedRange);
    console.log('Selected option:', selectedOption);
    console.log('Selected reason:', selectedReason);
    setSelectedRange(null);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedRange(null);
    setShowConfirmation(false);
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
                  : [
                    <MenuItem key="reason1" value="reason1">
                      Raison 1
                    </MenuItem>,
                    <MenuItem key="reason2" value="reason2">
                      Raison 2
                    </MenuItem>,
                    <MenuItem key="reason3" value="reason3">
                      Raison 3
                    </MenuItem>
                  ]}
              </Select>

            </Typography>
            <Button onClick={handleConfirm}>Confirm</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;

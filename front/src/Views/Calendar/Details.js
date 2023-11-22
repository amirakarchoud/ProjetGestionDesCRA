import React from 'react';
import moment from 'moment';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdEventBusy } from 'react-icons/md';

const DetailsCard = ({ event, onClose, onDelete }) => {
  const isActivity = event.type === 'Activity';
  const isAbsence = event.type === 'Absence';
  const isHoliday = event.type === 'Holiday';

  const headerIcon = isActivity ? <FaCalendarAlt /> : <MdEventBusy />;
  const headerText = isActivity ? 'Activity' : isAbsence ? 'Absence' : 'Holiday';
  const cardStyle = {
    backgroundColor: isHoliday ? '#FFD4D4' : '#E8F4FD',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '16px',
  };

  return (
    <Paper sx={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        {headerIcon}
        <Typography variant="h6" component="h2" style={{ marginLeft: '8px' }}>
          {headerText}
        </Typography>
      </div>
      <Typography>
        {isActivity ? (
          <>
            <strong>Projet:</strong> {event.title}
            <br />
            <strong>Date:</strong> {moment(event.start).format('LL')}
            <br />
            <strong>Periode:</strong> {event.matin ? 'matin' : 'apres-midi'}
          </>
        ) : isAbsence ? (
          <>
            <strong>Raison:</strong> {event.title}
            <br />
            <strong>Date:</strong> {moment(event.start).format('LL')}
            <br />
            <strong>Periode:</strong> {event.matin ? 'matin' : 'apres-midi'}
          </>
        ) : isHoliday ? (
          <>
            <strong>Holiday:</strong> {event.title}
            <br />
            <strong>Date:</strong> {moment(event.start).format('LL')}
          </>
        ) : null}
      </Typography>
      <Button onClick={onClose}>Close</Button>
      {onDelete && (isActivity || isAbsence) && <Button onClick={onDelete}>Delete</Button>}
    </Paper>
  );
};

export default DetailsCard;

import React from 'react';
import moment from 'moment';
import Button from '@mui/material/Button';

const DetailsCard = ({ event, onClose }) => {
  return (
    <div>
      {}
      <h3>{event.title}</h3>
      <p>{moment(event.start).format('LLL')}</p>
      {}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default DetailsCard;

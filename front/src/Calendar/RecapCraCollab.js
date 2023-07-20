import React from 'react';
import moment from 'moment';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdEventBusy } from 'react-icons/md';

const RecapCraCollab = ({ collabId }) => {

  const cardStyle = {
    backgroundColor: '#E8F4FD',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '16px',
  };

  return (
    <Paper sx={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        
        <Typography variant="h6" component="h2" style={{ marginLeft: '8px' }}>
          Recap Collab : {collabId}
        </Typography>
      </div>
      <Typography>
        
          <>
            <strong>Les jours travailles:</strong>
            <br />
            <strong>Nombres d'absences:</strong>
            <br />
            <strong>Nombre des jours vides:</strong> 
          </>
      </Typography>
    </Paper>
  );
};

export default RecapCraCollab;

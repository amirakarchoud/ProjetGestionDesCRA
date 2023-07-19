import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Button } from '@mui/material';
import { FaEdit } from 'react-icons/fa';

const ProjectDetails = () => {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/project/${projectCode}`, { mode: 'cors' });
        const data = await response.json();
        setProject(data);
        fetchCollabDetails(data.collabs);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [projectCode]);

  const fetchCollabDetails = async (collabIds) => {
    try {
      const response = await fetch('http://localhost:3000/collab/ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collabIds),
      });
      const data = await response.json();
      setCollabs(data);
    } catch (error) {
      console.error('Error fetching collab details:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '60%' }}>
      <h1>Project Details</h1>
      {project ? (
        <>
          <Typography variant="body1">Code du projet: {project.code}</Typography>
          <Typography variant="h6" style={{ marginTop: '16px' }}>Collabs:</Typography>
          <ul>
            {collabs.map((collab) => (
              <li key={collab._email}>
                <Typography variant="body2">{collab._name}</Typography>
              </li>
            ))}
          </ul>
          <Button variant="outlined" startIcon={<FaEdit />} style={{ marginTop: '16px' }}>Modifier</Button>
        </>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </div>
  );
};

export default ProjectDetails;

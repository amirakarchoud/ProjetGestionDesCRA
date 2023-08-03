import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [collabs, setCollabs] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/project/${projectCode}`, { mode: 'cors' });
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
      const response = await fetch(`${apiUrl}/collab/ids`, {
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
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '60%' }}>
      <h1>Project Details</h1>
      {project ? (
        <>
          <Typography variant="h6"><strong>Code du projet : </strong></Typography>
          <Typography variant="body">{project.code}</Typography>
          <Typography variant="h6" style={{ marginTop: '16px' }}><strong>Les collaborateurs :</strong> </Typography>
          <ul>
            {collabs.map((collab) => (
              <li key={collab._email}>
                <Typography variant="body">{collab._name}</Typography>
              </li>
            ))}
          </ul>
          <Link to={`/projectUpdate/${project.code}`} ><Button  variant="contained" color="primary" startIcon={<FaEdit />} style={{ marginTop: '16px', width: '50%' }}>Modifier</Button></Link>
          <Link to="/projects" ><Button variant="outlined" startIcon={<FaArrowLeft />} style={{ marginTop: '16px' }}>Annuler</Button></Link>
        </>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </div>
  );
};

export default ProjectDetails;

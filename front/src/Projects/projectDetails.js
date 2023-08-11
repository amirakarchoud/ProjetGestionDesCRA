import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ProjectDetails = () => {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [collabs, setCollabs] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem('token');
    return token;
  };
  const token = getTokenFromLocalStorage();
  const navigate=useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log('project code: '+projectCode);
        const response = await fetch(`${apiUrl}/project/${projectCode}`, {
          mode: 'cors', headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if(response.status === 401)
            {
              navigate('/login');
    
            }
        setProject(data);
        fetchCollabDetails(data._collabs);
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(collabIds),
      });
      const data = await response.json();
      if(response.status === 401)
            {
              navigate('/login');
    
            }
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
          <Typography variant="body">{project._code}</Typography>
          <Typography variant="h6"><strong>Nom du projet : </strong></Typography>
          <Typography variant="body">{project._name}</Typography>
          <Typography variant="h6"><strong>Nom du client : </strong></Typography>
          <Typography variant="body">{project._client}</Typography>
          <Typography variant="h6"><strong>Date debut du projet : </strong></Typography>
          <Typography variant="body">{moment(project._date).format('L')}</Typography>
          <Typography variant="h6"><strong>Status du projet : </strong></Typography>
          <Typography variant="body">{project._status}</Typography>
          <Typography variant="h6" style={{ marginTop: '16px' }}><strong>Les collaborateurs :</strong> </Typography>
          <ul>
            {collabs?.map((collab) => (
              <li key={collab._email}>
                <Typography variant="body">{collab._name}</Typography>
              </li>
            ))}
          </ul>
          <Link to={`/projectUpdate/${project._code}`} ><Button variant="contained" color="primary" startIcon={<FaEdit />} style={{ marginTop: '16px', width: '50%' }}>Modifier</Button></Link>
          <Link to="/projects" ><Button variant="outlined" startIcon={<FaArrowLeft />} style={{ marginTop: '16px' }}>Annuler</Button></Link>
        </>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </div>
  );
};

export default ProjectDetails;

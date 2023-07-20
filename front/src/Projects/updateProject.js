import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const UpdateProject = () => {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [code, setCode] = useState('');
  const [selectedCollabs, setSelectedCollabs] = useState([]);
  const [allCollabs, setAllCollabs] = useState([]);
  const apiUrl = 'http://localhost:3000';

  useEffect(() => {
    const fetchCollabs = async () => {
      try {
        const response = await fetch(apiUrl + '/collab/all');
        const data = await response.json();
        setAllCollabs(data);
        const projectResponse = await fetch(apiUrl + `/project/${projectCode}`, { mode: 'cors' });
        const projectData = await projectResponse.json();
        setProject(projectData);

        const selectedCollabsInProject = data.filter((collab) =>
          projectData.collabs.includes(collab._email)
        );
        setSelectedCollabs(selectedCollabsInProject);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCollabs();
  }, [projectCode]);

  const handleUpdateProject = async () => {
    const projectData = {
        code:projectCode,
      collabs: selectedCollabs.map((collab) => collab._email),
    };

    try {
      const response = await fetch(apiUrl + '/project/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast.success('Project updated successfully!');
        /* setTimeout(() => {
          history.push('/projects');
        }, 2000);*/
      } else {
        console.error('Error updating project:', response);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '50%' }}>
        <div style={{marginLeft:'10%',marginRight:'10%'}}>
      <h1>Modifier un Projet</h1>
      <br />
      <strong>Code du projet:</strong>
      <br />
      <TextField
        disabled
        label="Code du Projet"
        value={project ? project.code : ''}
        onChange={(e) => setCode(e.target.value)}
        style={{ marginBottom: '16px', width: '60%', marginTop: '16px' }}
      />
      <br />
      <strong>Les collaborateurs:</strong>
      <br />
      <Autocomplete
        multiple
        options={allCollabs}
        getOptionLabel={(option) => option._email}
        value={selectedCollabs}
        onChange={(event, newValue) => setSelectedCollabs(newValue)}
        filterSelectedOptions
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option._email} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Collaborateurs"
            placeholder="Sélectionnez les collaborateurs"
            style={{ width: '60%' , marginTop: '16px'}}
          />
        )}
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleUpdateProject} style={{ marginTop: '16px', width: '50%' }}>
        Modifier
      </Button>
      <br />
      <Link to="/projects">
        <Button variant="outlined" startIcon={<FaArrowLeft />} style={{ marginTop: '16px' }}>
          Annuler
        </Button>
      </Link>
    </div>
    </div>
  );
};

export default UpdateProject;

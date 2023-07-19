import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { FaProjectDiagram } from 'react-icons/fa'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const apiUrl = 'http://localhost:3000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("before fetch");
        const response = await fetch(apiUrl + '/project/all', { mode: 'cors' });
        console.log("the response " + response);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {}
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Rehercher un projet..."
              inputProps={{ 'aria-label': 'search projects' }}
            />
          </div>
          {/* Add Button */}
          <Button component={Link} to="/add-project" variant="contained" color="primary" endIcon={<FaProjectDiagram />}>
            Ajouter un Projet
          </Button>
        </Toolbar>
      </AppBar>
      <h1>Projets</h1>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item key={project.code} xs={12} sm={6} md={4}>
            <Paper sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '16px', backgroundColor: '#E8F4FD' }}>
              <div style={{ textAlign: 'center' }}>
                {/* img*/}
                <FaProjectDiagram style={{ fontSize: '64px', color: '#3f51b5' }} />
                <h3>{project.code}</h3>
                {/* go to details*/}
                <Link to={`/project/${project.code}`}>

                <Button variant="outlined" color="primary">
                  Afficher les Details
                </Button>
                </Link>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Projects;

import React, { useEffect, useState } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const apiUrl = 'http://localhost:3000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("before fetch")
        const response = await fetch(apiUrl+'/project/all', {mode:'cors'}); 
        console.log("the response "+response);
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
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.code}>
            <h3>{project.code}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Projects from './Projects/project';
import CalendarComponent from './Calendar/Calendar';
import ProjectDetails from './Projects/projectDetails';
import AddProject from './Projects/addProject';
import UpdateProject from './Projects/updateProject';
import RecapAdmin from './Admin/RecapAdmin';

const events = [
  
];

function Home() {
  return <h1>Welcome to the App!</h1>;
}

function App() {
  const user = 'user1';
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to={`/calendar/${user}`}>Calendar</Link>
            </li>
            <li>
              <Link to="/recap-admin">Admin</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/calendar/:user" element={<CalendarComponent />} />
          <Route exact path="/project/:projectCode" element={<ProjectDetails/>} />
          <Route exact path="/projectUpdate/:projectCode" element={<UpdateProject/>} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/recap-admin" element={<RecapAdmin />} />
       
        </Routes>
      </div>
    </Router>
  );
}

export default App;

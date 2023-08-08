import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import './App.css';
import Projects from './Projects/project';
import CalendarComponent from './Calendar/Calendar';
import ProjectDetails from './Projects/projectDetails';
import AddProject from './Projects/addProject';
import UpdateProject from './Projects/updateProject';
import RecapAdmin from './Admin/RecapAdmin';
import ProtectedRoute from './Auth/ProtectedRoute';
import { AuthProvider } from './Auth/AuthProvider';
import LoginApp from './Auth/Login';


function Home() {
  return <h1>Welcome to the App!</h1>;
}

function App() {
  const user = 'user1';
  return (
    <AuthProvider>
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
        <Route exact path="/login" element={<LoginApp/>} />
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/calendar/:user" element={<ProtectedRoute><CalendarComponent></CalendarComponent></ProtectedRoute>} />
          <Route path="*" element={<LoginApp/>} />
          <Route exact path="/project/:projectCode" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>} />
          <Route exact path="/projectUpdate/:projectCode" element={<ProtectedRoute><UpdateProject/></ProtectedRoute>} />
          <Route path="/add-project" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
          <Route path="/recap-admin" element={<ProtectedRoute><RecapAdmin /></ProtectedRoute>} />
       
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

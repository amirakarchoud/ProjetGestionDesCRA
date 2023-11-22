import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
// MUI
import { ThemeProvider } from '@mui/material';
import {pxfTheme} from "./mui-proxym-theme";
// UI
import Header from './Components/Header';
import { routes } from './Utils/Routes';
// Lazy-loaded Views
const ActivityReport = lazy(() => import('./Views/ActivityReport/ActivityReport'));
const NotFound = lazy(() => import('./Views/NotFound/NotFound'));
const Projects = lazy(() => import('./Views/Projects/project'));

function App() {
  return (
    <ThemeProvider theme={pxfTheme}>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={routes.activityReport} element={<ActivityReport />} />
            <Route path={routes.projects} element={<Projects />} />
            <Route path={routes.default} element={<Navigate to={routes.activityReport} />} />
            <Route path={routes.notFound} element={<NotFound />} />
          </Routes>
        </Suspense>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import LoginApp from './Login';

const ProtectedRoute = ({ children}) => {
  const { token } = React.useContext(AuthContext);

 /*  if (!token) {
    return <LoginApp />;
  } */
  return children;
};

export default ProtectedRoute;

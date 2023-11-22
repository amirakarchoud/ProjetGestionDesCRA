import React from 'react';
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

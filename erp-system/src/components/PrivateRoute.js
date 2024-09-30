import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => {
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated); // Add this log

  if (!isAuthenticated) {
    console.log('Redirecting to login'); // Add log to check when redirect happens
    return <Navigate to="/login" replace />;
  }
  
  console.log('Rendering children (authenticated)'); // Add log to check successful render
  return <Outlet />;
};

export default PrivateRoute;

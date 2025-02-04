// src/protected-route.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Adjust this according to your token storage

  // If token is not present, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element; // If token is present, render the element
};

export default ProtectedRoute;

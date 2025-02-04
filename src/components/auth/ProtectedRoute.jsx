import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    // Redirect to login if there's no user
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 
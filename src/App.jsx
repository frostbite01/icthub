import React, { useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import Layout from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './theme/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TaskList from './components/tasks/TaskList';

// Lazy load components
const Login = React.lazy(() => import('./components/auth/Login'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const Inventory = React.lazy(() => import('./components/inventory/Inventory'));
const History = React.lazy(() => import('./components/history/History'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  const [isSidebarVisible] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        {isLoginPage ? (
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        ) : (
          <Layout isSidebarVisible={isSidebarVisible}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </Layout>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 
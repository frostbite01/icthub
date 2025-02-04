import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, checkAuth } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth state on mount
    const authState = checkAuth();
    if (authState.hasToken && authState.hasApiKey && authState.hasUserId) {
      setUser({ id: localStorage.getItem('userId') });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('🔐 AuthContext: Attempting login');
      const response = await apiLogin(username, password);
      console.log('✅ AuthContext: Login successful', response);
      
      setUser({ id: response.id });
      return response;
    } catch (error) {
      console.error('❌ AuthContext: Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
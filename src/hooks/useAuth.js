import React, { useState, useEffect, createContext, useContext } from 'react';
import { login as apiLogin } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');
        const userId = localStorage.getItem('userId');
        
        if (token && apiKey && userId) {
            setUser({ token, apiKey, userId });
        }
        setLoading(false);
    }, []);

    const handleLogin = async (username, password) => {
        try {
            console.log('🔐 Attempting login with:', username);
            const data = await apiLogin(username, password);
            console.log('✅ Login successful:', data);
            
            // Store auth data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('apiKey', data.apiKey);
            localStorage.setItem('userId', data.id.toString());
            
            // Set user state with the same data structure as in useEffect
            setUser({
                token: data.token,
                apiKey: data.apiKey,
                userId: data.id.toString()
            });
            
            return data;
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login: handleLogin, 
            logout: handleLogout 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
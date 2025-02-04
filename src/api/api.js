import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:3001/api'
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['api-key'] = '1998-1999-2000-2001';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status,
            data: error.response?.data
        };
        return Promise.reject(customError);
    }
);

// Dashboard API
export const fetchDashboardData = async (filters = {}) => {
    try {
        const response = await api.get('/dashboard', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Dashboard API Error:', error);
        throw error;
    }
};

// Auth APIs
export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Login failed');
    }
};

// Inventory APIs
export const fetchInventory = async (filters = {}) => {
    try {
        const response = await api.get('/inventory', { params: filters });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const addItem = async (itemData) => {
    try {
        const response = await api.post('/inventory', itemData);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error adding item');
    }
};

export const updateItem = async (id, itemData) => {
    try {
        // Remove threshold data from item update
        const { optimal_threshold, low_threshold, ...itemFields } = itemData;
        console.log('Updating item fields:', itemFields);
        
        // First update the item
        const itemResponse = await api.put(`/inventory/${id}`, itemFields);
        console.log('Item update response:', itemResponse.data);

        // Then update thresholds if they exist
        if (optimal_threshold !== undefined || low_threshold !== undefined) {
            console.log('Updating thresholds:', { medium: optimal_threshold, low: low_threshold });
            const thresholdResponse = await api.put(`/inventory/${id}/thresholds`, {
                medium: parseInt(optimal_threshold) || 0,
                low: parseInt(low_threshold) || 0
            });
            console.log('Threshold update response:', thresholdResponse.data);
        }
        
        return itemResponse.data;
    } catch (error) {
        console.error('Error updating item:', error.response?.data || error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error deleting item');
    }
};

// Threshold APIs
export const fetchThresholds = async () => {
    try {
        const response = await api.get('/stock-thresholds');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error fetching thresholds');
    }
};

export const updateThresholds = async (thresholds) => {
    try {
        const response = await api.post('/inventory/thresholds', thresholds);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Category and Type APIs
export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error fetching categories');
    }
};

export const fetchTypes = async () => {
    try {
        const response = await api.get('/types');
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error fetching types');
    }
};

// Log APIs
export const fetchLogs = async (params = {}) => {
    try {
        const response = await api.get('/logs', { params });
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error fetching logs');
    }
};

export const createLog = async (logData) => {
    try {
        const response = await api.post('/logs', logData);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Error creating log');
    }
};

// Add these new methods for item management
export const updateItemThresholds = async (id, thresholds) => {
    try {
        const response = await api.put(`inventory/${id}/thresholds`, thresholds);
        return response.data;
    } catch (error) {
        console.error('Error updating thresholds:', error.response || error);
        throw error;
    }
};

// Utility function for handling API errors
export const handleApiError = (error) => {
    console.error('API Error:', error);
    return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: error.status || 500
    };
};

export default api;
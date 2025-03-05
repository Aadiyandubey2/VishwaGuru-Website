import axios from 'axios';

// Create axios instance with proper base URL
export const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? 'http://localhost:5000/api'  // Development
    : '/api',                      // Production (relative to current domain)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data);
    } 
    
    if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({ 
        success: false, 
        message: 'No response from server. Please try again later.' 
      });
    }
    
    console.error('Error:', error.message);
    return Promise.reject({ 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    });
  }
);

// Helper function to safely handle localStorage operations
const localStorageHelper = {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};

// Numerology service with proper error handling
export const numerologyService = {
  saveReading: async (name: string, birthdate: string) => {
    try {
      const response = await api.post('/numerology/readings', { name, birthdate });
      return response.data;
    } catch (error: any) {
      console.error('Error saving reading:', error);
      
      // Only use fallback in development
      if (import.meta.env.DEV) {
        const readings = localStorageHelper.getItem('numerologyReadings') || [];
        const newReading = {
          id: Date.now().toString(),
          name,
          date: birthdate,
          result: {
            destinyNumber: Math.floor(Math.random() * 9) + 1,
            soulUrgeNumber: Math.floor(Math.random() * 9) + 1,
            personalityNumber: Math.floor(Math.random() * 9) + 1,
            lifePathNumber: Math.floor(Math.random() * 9) + 1,
            birthdayNumber: Math.floor(Math.random() * 9) + 1
          },
          createdAt: new Date().toISOString()
        };
        readings.push(newReading);
        localStorageHelper.setItem('numerologyReadings', readings);
        return { success: true, reading: newReading };
      }
      
      throw error;
    }
  },
  
  getUserReadings: async () => {
    try {
      const response = await api.get('/numerology/readings');
      return response.data.readings;
    } catch (error: any) {
      console.error('Error fetching readings:', error);
      
      // Only use fallback in development
      if (import.meta.env.DEV) {
        return localStorageHelper.getItem('numerologyReadings') || [];
      }
      
      throw error;
    }
  },
  
  deleteReading: async (id: string) => {
    try {
      const response = await api.delete(`/numerology/readings/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting reading:', error);
      
      // Only use fallback in development
      if (import.meta.env.DEV) {
        const readings = localStorageHelper.getItem('numerologyReadings') || [];
        const updatedReadings = readings.filter((reading: any) => reading.id !== id);
        localStorageHelper.setItem('numerologyReadings', updatedReadings);
        return { success: true };
      }
      
      throw error;
    }
  }
};
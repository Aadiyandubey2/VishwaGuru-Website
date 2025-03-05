import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://numerology-website-xi.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
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

export const numerologyService = {
  saveReading: async (name: string, birthdate: string) => {
    try {
      const response = await api.post('/numerology/readings', { name, birthdate });
      return response.data;
    } catch (error: any) {
      console.error('Error saving reading:', error);
      throw error;
    }
  },
  
  getUserReadings: async () => {
    try {
      const response = await api.get('/numerology/readings');
      return response.data.readings;
    } catch (error: any) {
      console.error('Error fetching readings:', error);
      throw error;
    }
  },
  
  deleteReading: async (id: string) => {
    try {
      const response = await api.delete(`/numerology/readings/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting reading:', error);
      throw error;
    }
  }
};
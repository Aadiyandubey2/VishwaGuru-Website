import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login if not authenticated
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Numerology service functions
export const numerologyService = {
  // Save a numerology reading
  saveReading: async (name: string, birthdate: string) => {
    try {
      const response = await api.post('/numerology/readings', { name, birthdate });
      return response.data;
    } catch (error) {
      console.error('Save reading error:', error);
      throw error;
    }
  },
  
  // Get all readings for current user
  getUserReadings: async () => {
    try {
      const response = await api.get('/numerology/readings');
      return response.data.readings;
    } catch (error) {
      console.error('Get readings error:', error);
      throw error;
    }
  },
  
  // Delete a reading
  deleteReading: async (id: string) => {
    try {
      const response = await api.delete(`/numerology/readings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete reading error:', error);
      throw error;
    }
  }
};
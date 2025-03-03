import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // Add a timeout (10 seconds)
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify request config here if needed
    // For example, add auth tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
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
    const response = await api.post('/numerology/readings', { name, birthdate });
    return response.data;
  },
  
  // Get all readings for current user
  getUserReadings: async () => {
    const response = await api.get('/numerology/readings');
    return response.data.readings;
  },
  
  // Delete a reading
  deleteReading: async (id: string) => {
    const response = await api.delete(`/numerology/readings/${id}`);
    return response.data;
  }
};
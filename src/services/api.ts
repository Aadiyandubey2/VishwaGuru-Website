import axios from 'axios';

// Create API instance with proper configuration
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify request config here if needed
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
      console.log('No response received - server may not be running');
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Fallback to local storage if server is unavailable
const getLocalStorageReadings = () => {
  try {
    const readings = localStorage.getItem('numerologyReadings');
    return readings ? JSON.parse(readings) : [];
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
};

const saveLocalStorageReadings = (readings) => {
  try {
    localStorage.setItem('numerologyReadings', JSON.stringify(readings));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

// Numerology service functions
export const numerologyService = {
  // Save a numerology reading
  saveReading: async (name: string, birthdate: string) => {
    try {
      const response = await api.post('/numerology/readings', { name, birthdate });
      return response.data;
    } catch (error) {
      console.error('Error saving reading:', error);
      
      // Fallback to local storage
      try {
        const readings = getLocalStorageReadings();
        const newReading = {
          id: Date.now().toString(),
          name,
          date: birthdate,
          result: {
            destinyNumber: 0, // These would be calculated properly in a real app
            soulUrgeNumber: 0,
            personalityNumber: 0,
            lifePathNumber: 0,
            birthdayNumber: 0
          },
          createdAt: new Date().toISOString()
        };
        readings.push(newReading);
        saveLocalStorageReadings(readings);
        return { success: true, reading: newReading };
      } catch (e) {
        console.error('Fallback storage failed:', e);
      }
      
      throw error;
    }
  },
  
  // Get all readings for current user
  getUserReadings: async () => {
    try {
      const response = await api.get('/numerology/readings');
      return response.data.readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
      
      // Fallback to local storage
      return getLocalStorageReadings();
    }
  },
  
  // Delete a reading
  deleteReading: async (id: string) => {
    try {
      const response = await api.delete(`/numerology/readings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reading:', error);
      
      // Fallback to local storage
      try {
        const readings = getLocalStorageReadings();
        const updatedReadings = readings.filter(reading => reading.id !== id);
        saveLocalStorageReadings(updatedReadings);
        return { success: true };
      } catch (e) {
        console.error('Fallback deletion failed:', e);
      }
      
      throw error;
    }
  }
};
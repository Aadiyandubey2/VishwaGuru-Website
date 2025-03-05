import axios from 'axios';


export const api = axios.create({
  baseURL: 'vishwaguru-website-k8p73f9vz-aadiyan-dubeys-projects.vercel.app',
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
    } else if (error.request) {
      console.log('No response received - server may not be running');
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

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

export const numerologyService = {
  saveReading: async (name: string, birthdate: string) => {
    try {
      const response = await api.post('/numerology/readings', { name, birthdate });
      return response.data;
    } catch (error) {
      console.error('Error saving reading:', error);
      
      try {
        const readings = getLocalStorageReadings();
        const newReading = {
          id: Date.now().toString(),
          name,
          date: birthdate,
          result: {
            destinyNumber: 0, 
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
  
  getUserReadings: async () => {
    try {
      const response = await api.get('/numerology/readings');
      return response.data.readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
      
      return getLocalStorageReadings();
    }
  },
  
  deleteReading: async (id: string) => {
    try {
      const response = await api.delete(`/numerology/readings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reading:', error);
      
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
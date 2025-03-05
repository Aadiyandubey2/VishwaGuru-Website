import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


const USER_STORAGE_KEY = 'vishwaguru_user';

const saveUserToLocalStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

const getUserFromLocalStorage = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('Error reading user from localStorage:', e);
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      saveUserToLocalStorage(currentUser);
    }
  }, [currentUser, loading]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        const storedUser = getUserFromLocalStorage();
        if (storedUser) {
          setCurrentUser(storedUser);
        }
        
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.log('Server authentication check failed, using local storage');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.log('Signup error:', error.message);
      
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: Date.now(),
          name,
          email
        };
        setCurrentUser(mockUser);
        return;
      }
      
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.log('Login error:', error.message);
      
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: Date.now(),
          name: email.split('@')[0], 
          email
        };
        setCurrentUser(mockUser);
        return;
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setCurrentUser(null);
    } catch (error: any) {
      console.log('Logout error:', error.message);
      setCurrentUser(null);
    }
  };

  const updateProfile = async (name: string) => {
    try {
      const response = await api.put('/users/profile', { name });
      
      if (response.data.success) {
        setCurrentUser(prev => prev ? { ...prev, name } : null);
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error: any) {
      console.log('Update profile error:', error.message);
      
      if (currentUser) {
        setCurrentUser({ ...currentUser, name });
      }
      
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', {
        currentPassword,
        newPassword
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error: any) {
      console.log('Change password error:', error.message);
      
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return;
      }
      
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await api.delete('/users/account');
      
      if (response.data.success) {
        setCurrentUser(null);
      } else {
        throw new Error(response.data.message || 'Account deletion failed');
      }
    } catch (error: any) {
      console.log('Delete account error:', error.message);
      
      setCurrentUser(null);
      
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
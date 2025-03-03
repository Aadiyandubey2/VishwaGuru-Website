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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // User is not authenticated, that's okay
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
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
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login user
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
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (name: string) => {
    try {
      const response = await api.put('/users/profile', { name });
      
      if (response.data.success) {
        setCurrentUser(prev => prev ? { ...prev, name } : null);
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', {
        currentPassword,
        newPassword
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      const response = await api.delete('/users/account');
      
      if (response.data.success) {
        setCurrentUser(null);
      } else {
        throw new Error(response.data.message || 'Account deletion failed');
      }
    } catch (error) {
      console.error('Delete account error:', error);
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
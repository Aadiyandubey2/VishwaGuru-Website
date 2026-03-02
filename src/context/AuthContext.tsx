import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

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
        
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          setCurrentUser(response.user);
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
      const response = await authService.register(email, password, name);
      if (response.success) {
        setCurrentUser(response.user);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setCurrentUser(response.user);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentUser(null);
    }
  };

  const updateProfile = async (name: string) => {
    try {
      const response = await authService.updateProfile(name);
      if (response.success) {
        setCurrentUser(response.user);
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await authService.deleteAccount();
      if (response.success) {
        setCurrentUser(null);
      } else {
        throw new Error('Account deletion failed');
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
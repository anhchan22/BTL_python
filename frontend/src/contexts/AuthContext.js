import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch current user
          const response = await api.get('/auth/me/');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { user, tokens } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);

      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response data:', error.response?.data);

      // Handle network errors
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return {
          success: false,
          error: 'Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000'
        };
      }

      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { user, tokens } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);

      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Response data:', error.response?.data);

      // Handle network errors
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return {
          success: false,
          error: 'Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000'
        };
      }

      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Clear auth header
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
  };

  const isAdmin = () => {
    return user?.profile?.role === 'ADMIN';
  };

  const isTenant = () => {
    return user?.profile?.role === 'TENANT';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isTenant,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

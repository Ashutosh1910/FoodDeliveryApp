import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const savedProfile = localStorage.getItem('profile');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ username, password });
      const { user, user_type, tokens } = response.data;

      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', user_type);

      setUser(user);
      setUserType(user_type);

      // Fetch user profile
      await fetchCurrentUser();

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { user, tokens } = response.data;

      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', userData.user_type);

      setUser(user);
      setUserType(userData.user_type);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('profile');
      setUser(null);
      setUserType(null);
      setProfile(null);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const { user, user_type, profile } = response.data;

      setUser(user);
      setUserType(user_type);
      setProfile(profile);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', user_type);
      if (profile) {
        localStorage.setItem('profile', JSON.stringify(profile));
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('profile', JSON.stringify(newProfile));
  };

  const value = {
    user,
    userType,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    isAuthenticated: !!user,
    isSeller: userType === 'seller',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

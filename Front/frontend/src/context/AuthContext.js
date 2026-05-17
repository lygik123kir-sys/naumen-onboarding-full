import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setHasCompletedOnboarding(onboardingCompleted);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      setHasCompletedOnboarding(onboardingCompleted);
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithSSO = async (provider) => {
    setError(null);
    try {
      await apiService.loginWithSSO(provider);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const acceptInvite = async (token, userData) => {
    setError(null);
    try {
      const response = await apiService.acceptInvite(token, userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setHasCompletedOnboarding(false);
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const completeOnboarding = async (formData) => {
    setError(null);
    try {
      await apiService.completeOnboarding(formData);
      setHasCompletedOnboarding(true);
      localStorage.setItem('onboardingCompleted', 'true');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const updatedUser = await apiService.updateUserProfile(profileData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    hasCompletedOnboarding,
    loading,
    error,
    login,
    loginWithSSO,
    acceptInvite,
    completeOnboarding,
    updateProfile,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
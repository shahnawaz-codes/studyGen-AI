import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('studygen_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user from backend whenever token changes
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me', { token });
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('studygen_token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        localStorage.removeItem('studygen_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [token]);

  // Trigger Google Login Redirect
  const loginWithGoogle = () => {
    window.location.href = `${api.baseUrl}/auth/google`;
  };

  // Save session token from OAuth redirect
  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('studygen_token', newToken);
    setToken(newToken);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('studygen_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        loginWithGoogle,
        handleAuthSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

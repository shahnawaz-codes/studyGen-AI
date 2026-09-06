import React, { createContext, useContext, useState, useEffect } from 'react';

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
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('studygen_token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [token]);

  // Trigger Google Login Redirect
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
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

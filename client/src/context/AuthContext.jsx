import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // Using your existing axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // FIX: If 401, it just means user is not logged in. Don't log as error.
        if (error.response && error.response.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Log actual network errors
          console.error("Auth check failed:", error.message);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.success) {
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
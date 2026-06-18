import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(localStorage.getItem('fl_token'));
  const [loading, setLoading]     = useState(true);

  // On mount, rehydrate user from token
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('fl_token');
      if (stored) {
        try {
          const me = await authService.getMe();
          setUser(me);
        } catch {
          localStorage.removeItem('fl_token');
          localStorage.removeItem('fl_user');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('fl_token', data.token);
    localStorage.setItem('fl_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('fl_token', data.token);
    localStorage.setItem('fl_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('fl_user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

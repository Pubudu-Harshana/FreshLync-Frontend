import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const getStoredUser = () => {
    const stored = sessionStorage.getItem('fl_user') || localStorage.getItem('fl_user');
    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && !parsed._id) parsed._id = parsed.id;
        if (parsed && parsed._id && !parsed.id) parsed.id = parsed._id;
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  const getStoredToken = () => {
    return sessionStorage.getItem('fl_token') || localStorage.getItem('fl_token');
  };

  const [user, setUserState] = useState(getStoredUser);

  const setUser = (val) => {
    if (typeof val === 'function') {
      setUserState(prev => {
        const res = val(prev);
        if (res) {
          const cloned = { ...res };
          if (cloned.id && !cloned._id) cloned._id = cloned.id;
          if (cloned._id && !cloned.id) cloned.id = cloned._id;
          return cloned;
        }
        return res;
      });
    } else {
      const res = val;
      if (res) {
        const cloned = { ...res };
        if (cloned.id && !cloned._id) cloned._id = cloned.id;
        if (cloned._id && !cloned.id) cloned.id = cloned._id;
        setUserState(cloned);
      } else {
        setUserState(res);
      }
    }
  };

  const [token, setToken]     = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  const saveAuthData = (data) => {
    const isAdmin = data.user?.role === 'admin';
    if (isAdmin) {
      // Admin session is browser-session bound (cleared automatically when browser/tab is closed)
      sessionStorage.setItem('fl_token', data.token);
      sessionStorage.setItem('fl_user', JSON.stringify(data.user));
      localStorage.removeItem('fl_token');
      localStorage.removeItem('fl_user');
    } else {
      localStorage.setItem('fl_token', data.token);
      localStorage.setItem('fl_user', JSON.stringify(data.user));
      sessionStorage.removeItem('fl_token');
      sessionStorage.removeItem('fl_user');
    }
    setToken(data.token);
    setUser(data.user);
  };

  // On mount, rehydrate user from token
  useEffect(() => {
    const init = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const me = await authService.getMe();
          setUser(me);
          const isAdmin = me?.role === 'admin';
          if (isAdmin) {
            sessionStorage.setItem('fl_user', JSON.stringify(me));
          } else {
            localStorage.setItem('fl_user', JSON.stringify(me));
          }
        } catch (err) {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem('fl_token');
            localStorage.removeItem('fl_user');
            sessionStorage.removeItem('fl_token');
            sessionStorage.removeItem('fl_user');
            setToken(null);
            setUser(null);
          } else {
            const fallbackUser = getStoredUser();
            if (fallbackUser) setUser(fallbackUser);
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    saveAuthData(data);
    return data.user;
  };

  const loginWithGoogle = async (accessToken, role) => {
    const data = await authService.googleLogin(accessToken, role);
    saveAuthData(data);
    return { ...data.user, isNewUser: data.isNewUser };
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    saveAuthData(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
    sessionStorage.removeItem('fl_token');
    sessionStorage.removeItem('fl_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    console.log('[AuthContext] updateUser called with:', updated);
    if (updated) {
      const cloned = { ...updated };
      if (cloned.id && !cloned._id) cloned._id = cloned.id;
      if (cloned._id && !cloned.id) cloned.id = cloned._id;
      setUser(cloned);
      if (cloned.role === 'admin') {
        sessionStorage.setItem('fl_user', JSON.stringify(cloned));
      } else {
        localStorage.setItem('fl_user', JSON.stringify(cloned));
      }
      console.log('[AuthContext] user state and storage updated to:', cloned);
    } else {
      setUser(null);
      localStorage.removeItem('fl_user');
      sessionStorage.removeItem('fl_user');
      console.log('[AuthContext] user state cleared');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    loginWithGoogle,
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

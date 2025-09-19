import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const data = await api.me();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchMe(); }, []);

  const login = async (creds) => {
    const data = await api.login(creds);
    setUser(data);
    return data;
  };
  const register = async (creds) => {
    const data = await api.register(creds);
    setUser(data);
    return data;
  };
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, fetchMe }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

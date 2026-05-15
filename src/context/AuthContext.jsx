import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAuth = useCallback((data) => {
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      profile: data.profile,
      dailyNorms: data.dailyNorms,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.getMe();
    setUser(res.data);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    applyAuth(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    applyAuth(res.data);
    return res.data;
  };

  const updateProfile = async (payload) => {
    const res = await authApi.updateProfile(payload);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

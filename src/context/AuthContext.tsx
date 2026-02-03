'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  sendOtp: (email: string) => Promise<void>;
  login: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      // Quietly fail
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    await api.post('/auth/send-otp', { email });
  };

  const login = async (email: string, code: string) => {
    const res = await api.post('/auth/verify-otp', { email, code });
    const { access_token, user } = res.data;
    localStorage.setItem('token', access_token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, sendOtp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocal, saveToLocal, getOneFromLocal, seedMockData } from './local-storage';

type User = any;

interface AuthContextType {
  user: User | null;
  adminUser: any | null;
  loading: boolean;
  signInWithPassword: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginAdmin: (username: string, pass: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminUser: null,
  loading: true,
  signInWithPassword: async () => false,
  signUp: async () => false,
  logout: async () => {},
  loginAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao iniciar, garante que test user existe localmente
    seedMockData();

    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedAdmin = localStorage.getItem('adminSession');
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }

    setLoading(false);
  }, []);

  const signInWithPassword = async (email: string, pass: string) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getFromLocal('users');
    const foundUser = users.find((u: any) => u.email === email && u.password === pass);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('userSession', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signUp = async (email: string, pass: string) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getFromLocal('users');
    const exists = users.find((u: any) => u.email === email);
    if (exists) return false;
    
    const newUser = { id: Date.now().toString(), uid: Date.now().toString(), email, password: pass };
    saveToLocal('users', newUser);
    setUser(newUser);
    localStorage.setItem('userSession', JSON.stringify(newUser));
    // Semeia dados ficticios logo pos cadastro
    seedMockData(newUser.id);
    return true;
  };

  const loginAdmin = (username: string, pass: string) => {
    const admins = getFromLocal('admins');
    const admin = admins.find((a: any) => a.username === username && a.password === pass);
    if (admin) {
      setAdminUser(admin);
      localStorage.setItem('adminSession', JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    setAdminUser(null);
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
  };

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, signInWithPassword, signUp, logout, loginAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

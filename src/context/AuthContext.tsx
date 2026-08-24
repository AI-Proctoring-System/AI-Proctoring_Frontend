'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeToken, DecodedToken } from '../utils/api';

interface AuthContextType {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('proctor_token');
      if (token) {
        const decoded = decodeToken(token);
        // Check if token is expired
        if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          // Token expired
          localStorage.removeItem('proctor_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Error checking auth:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Add event listener to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'proctor_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('proctor_token', token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('proctor_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

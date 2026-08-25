'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { decodeToken, DecodedToken, apiRequest } from '../utils/api';

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

  const fetchProfileDetails = useCallback(async (decoded: DecodedToken) => {
    try {
      const profile = await apiRequest<{ firstName?: string; lastName?: string; company?: { name: string } }>('auth/profile');
      if (profile) {
        setUser({
          ...decoded,
          firstName: profile.firstName,
          lastName: profile.lastName,
          company: profile.company,
        });
      }
    } catch (err) {
      console.error('Error loading full user profile:', err);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('proctor_token');
      if (token) {
        const decoded = decodeToken(token);
        // Check if token is expired
        if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          await fetchProfileDetails(decoded);
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
  }, [fetchProfileDetails]);

  useEffect(() => {
    setTimeout(() => {
      checkAuth();
    }, 0);
    
    // Add event listener to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'proctor_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  const login = async (token: string) => {
    localStorage.setItem('proctor_token', token);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
      await fetchProfileDetails(decoded);
    }
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

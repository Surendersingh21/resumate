import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<User>;
  createUserWithEmailAndPassword: (email: string, password: string, displayName?: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = () => {
    return authService.signInWithGoogle();
  };

  const signInWithEmailAndPassword = (email: string, password: string) => {
    return authService.signInWithEmailAndPassword(email, password);
  };

  const createUserWithEmailAndPassword = (email: string, password: string, displayName?: string) => {
    return authService.createUserWithEmailAndPassword(email, password, displayName);
  };

  const signOut = () => {
    return authService.signOut();
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VALID_USERNAME, VALID_PASSWORD, SESSION_KEY, USERNAME_KEY } from '../constants/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [username, setUsername] = useState<string | null>(() => {
    return sessionStorage.getItem(USERNAME_KEY) || null;
  });

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, isAuthenticated ? 'true' : 'false');
    if (isAuthenticated && username) {
      sessionStorage.setItem(USERNAME_KEY, username);
    } else {
      sessionStorage.removeItem(USERNAME_KEY);
    }
  }, [isAuthenticated, username]);

  const login = (usernameInput: string, password: string): boolean => {
    if (usernameInput === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUsername(usernameInput);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
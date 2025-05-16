import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_USERNAME = 'ronald';
const VALID_PASSWORD = 'new_project';
const SESSION_KEY = 'isAuthenticated';
const USERNAME_KEY = 'username';

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
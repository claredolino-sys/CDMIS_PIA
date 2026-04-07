
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, Role } from '../types';
import { authenticateUser, getMockUsers } from '../services/mockApi';
// import { loginAPI } from '../services/mysqlApi'; // UNCOMMENT FOR REAL API

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cdmis_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        return null;
      }
    }
    return null;
  });

  const login = useCallback(async (userId: string, password: string): Promise<boolean> => {
    // SWITCH TO THIS FOR REAL API:
    // const user = await loginAPI(userId, password);
    
    // CURRENT MOCK:
    const user = authenticateUser(userId, password);
    
    if (user) {
      const userToSave = { ...user };
      delete userToSave.password; // Don't save password in localStorage
      setCurrentUser(userToSave);
      localStorage.setItem('cdmis_user', JSON.stringify(userToSave));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('cdmis_user');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!currentUser, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

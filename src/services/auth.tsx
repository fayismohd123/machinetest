import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, Hospital, UserInfo, LoginRequest } from '../types';
import { preloginAuthentication, userLogin, clearAuthData } from './api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedHospital = localStorage.getItem('hospital');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);

      if (storedHospital) {
        setHospital(JSON.parse(storedHospital));
      }
    }
  }, []);

  const preAuth = async (phoneNumber: string): Promise<Hospital[]> => {
    try {
      const hospitals = await preloginAuthentication(phoneNumber);
      return hospitals;
    } catch (error) {
      console.error('Pre-auth error:', error);
      throw error;
    }
  };

  const login = async (phoneNumber: string, hospitalId: number, password: string): Promise<void> => {
    try {
      const loginData: LoginRequest = {
        PhoneNumber: phoneNumber,
        HospitalID: hospitalId,
        Password: password,
      };

      const response = await userLogin(loginData);

      if (response.Token) {
        const userData: UserInfo = {
          Username: response.Username,
          PhoneNumber: response.Phone,
          HospitalName: response.HospitalName,
          HospitalID: response.HospitalID,
        };

        setToken(response.Token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', response.Token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    clearAuthData();
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setHospital(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    hospital,
    login,
    logout,
    preAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

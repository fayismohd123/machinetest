import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, Hospital, UserInfo, LoginRequest } from '../types';
import { preloginAuthentication, userLogin, clearAuthData } from './api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const HOSPITAL_KEY = 'hospital';

const parseStoredJSON = <T,>(rawValue: string | null): T | null => {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = parseStoredJSON<UserInfo>(localStorage.getItem(USER_KEY));
    const storedHospital = parseStoredJSON<Hospital>(localStorage.getItem(HOSPITAL_KEY));

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setHospital(storedHospital);
      setIsAuthenticated(true);
      return;
    }

    if (storedToken || localStorage.getItem(USER_KEY) || localStorage.getItem(HOSPITAL_KEY)) {
      clearAuthData();
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
        const selectedHospital: Hospital = {
          hospital_id: response.HospitalID,
          hospital_name: response.HospitalName,
        };

        const userData: UserInfo = {
          Username: response.Username,
          PhoneNumber: response.Phone,
          HospitalName: response.HospitalName,
          HospitalID: response.HospitalID,
        };

        setToken(response.Token);
        setUser(userData);
        setHospital(selectedHospital);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_TOKEN_KEY, response.Token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(HOSPITAL_KEY, JSON.stringify(selectedHospital));
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      clearAuthData();
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      setHospital(null);
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

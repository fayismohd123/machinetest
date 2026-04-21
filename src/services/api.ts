import axios, { AxiosError } from 'axios';
import { Hospital, PreAuthResponse, LoginRequest, LoginResponse } from '../types';

const DEFAULT_REMOTE_API_URL = 'http://machinetest.grapesonline.net/api';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : DEFAULT_REMOTE_API_URL);
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const HOSPITAL_KEY = 'hospital';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth and return to login.
      clearAuthData();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const mapLoginError = (error: AxiosError): string => {
  if (!error.response) {
    const errorCode = error.code || '';
    const runningOnHttps = window.location.protocol === 'https:';
    const callingInsecureHttpApi = API_BASE_URL.startsWith('http://');

    if (runningOnHttps && callingInsecureHttpApi) {
      return 'Request blocked by browser security (HTTPS page calling HTTP API). Use an HTTPS API URL or a dev proxy.';
    }

    if (errorCode === 'ECONNABORTED') {
      return 'Request timed out. The server took too long to respond.';
    }

    if (
      errorCode === 'ERR_NETWORK' ||
      errorCode === 'ENOTFOUND' ||
      errorCode === 'ECONNREFUSED'
    ) {
      return 'Unable to reach login server. Check internet, VPN/firewall, or API availability.';
    }

    return 'Network error. Please check your connection and try again.';
  }

  const errorData = error.response.data as { message?: string } | undefined;
  if (typeof errorData?.message === 'string' && errorData.message.trim()) {
    return errorData.message;
  }

  if (error.response.status === 401) {
    return 'Invalid credentials. Please check your phone number, hospital, and password.';
  }

  return 'Login failed. Please try again.';
};

/**
 * Pre-authentication API: Get hospitals list by phone number
 */
export const preloginAuthentication = async (phoneNumber: string): Promise<Hospital[]> => {
  try {
    const response = await apiClient.post<PreAuthResponse>(
      `/Login/PreloginAuthentication?Phonenumber=${phoneNumber}`
    );
    return response.data.Hospital || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Pre-authentication error:', axiosError.response?.data || axiosError.message);
    throw new Error('Failed to fetch hospitals. Please try again.');
  }
};

/**
 * User login API: Authenticate user with phone, hospital, and password
 */
export const userLogin = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/Login/UserLogin',
      {
        ...loginData,
        HospitalID: String(loginData.HospitalID), // 🔥 change here
      }
    );
    if (!response.data?.Token) {
      throw new Error('Login response did not include an authentication token.');
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = mapLoginError(axiosError);
    console.error('RAW ERROR RESPONSE:', axiosError.response?.data);
    console.error('STATUS:', axiosError.response?.status);
    console.error('FULL ERROR:', axiosError);
    throw new Error(errorMessage);
  }
};

/**
 * Get auth token from storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Clear auth data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(HOSPITAL_KEY);
};

export default apiClient;

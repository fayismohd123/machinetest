import axios, { AxiosError } from 'axios';
import { Hospital, PreAuthResponse, LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = 'http://machinetest.grapesonline.net/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
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
      // Token expired or invalid, clear auth
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('hospital');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

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
    const response = await apiClient.post<LoginResponse>('/Login/UserLogin', loginData);

    if (response.data.Token) {
      localStorage.setItem('authToken', response.data.Token);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    const errorMessage = errorData?.message || 'Login failed. Please try again.';
    console.error('Login error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get auth token from storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Clear auth data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('hospital');
};

export default apiClient;

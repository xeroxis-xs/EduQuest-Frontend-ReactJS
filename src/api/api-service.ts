// src/api/api-service.ts

import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { handleAuthError } from '@/lib/auth/auth-handler';
import { logger } from '@/lib/default-logger';

// Create an Axios instance for general API calls
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    logger.error('Failed to set access-token for API request.', error);
    return Promise.reject(new Error('Failed to set access-token for API request.'));
  }
);

/**
 * Centralized error handling function
 */
const handleError = async (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized: Trigger authentication flow
        await handleAuthError();
        break;
      case 403:
        // Forbidden: Inform the user they don't have access
        logger.warn('Access forbidden: You do not have permission to perform this action.');
        break;
      case 404:
        // Not Found: Inform the user the resource doesn't exist
        logger.warn('Resource not found.');
        break;
      default:
        // Other errors
        logger.error(`API Error: ${status.toString()}`, data);
    }
  } else if (error.request) {
    // No response received
    logger.error('No response received from the API.', error.request);
  } else {
    // Error setting up the request
    logger.error('Error in setting up the API request.', error.message);
  }

  // Optionally, you can throw a custom error or rethrow the original error
  throw error;
};

// Response interceptor to handle errors centrally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => handleError(error)
);

export default api;

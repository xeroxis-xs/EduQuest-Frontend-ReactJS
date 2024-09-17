'use client';

import axios, { AxiosError, type AxiosResponse } from 'axios';
import { handleLoginRedirect, handleLogout, msalInstance } from "@/app/msal/msal";
import { logger } from '@/lib/default-logger';
import type { EduquestUser } from "@/types/eduquest-user";
import { type AccountInfo } from "@azure/msal-browser";

/**
 * Create a separate Axios instance for AuthClient to avoid circular dependencies.
 */
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Optional: Add request interceptors if needed for authApi
authApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    logger.error('Failed to set access-token for Auth API request.', error);
    return Promise.reject(new Error('Failed to set access-token for Auth API request.'));
  }
);

class AuthClient {

  /**
   * Initiates the sign-in process using MSAL.
   */
  async signInWithMsal(): Promise<{ error?: string }> {
    try {
      localStorage.removeItem('access-token');
      msalInstance.setActiveAccount(null);

      await handleLoginRedirect();
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing in', err);
      return { error: err.message };
    }
  }

  /**
   * Retrieves the authenticated user and their EduquestUser profile.
   */
  async getUser(): Promise<{
    data: {
      user: AccountInfo | null;
      eduquestUser: EduquestUser | null;
    }
    error?: string
  }> {
    const token = localStorage.getItem('access-token');
    logger.debug('access-token obtained from localStorage');

    if (token === null) {
      logger.debug('No access token found, redirect to Login');
      // Optionally, you can trigger sign-in here
      return {
        data: {
          user: null,
          eduquestUser: null
        }
      };
    }

    // token is present, set it in the msal instance
    const msalUser = msalInstance.getActiveAccount();
    const eduquestUser = await this.getEduquestUser(msalUser?.username ?? '');

    // Check if the email domain is allowed
    if (msalUser?.username &&
      !msalUser.username.includes('@e.ntu.edu.sg') &&
      !msalUser.username.includes('@ntu.edu.sg') &&
      !msalUser.username.includes('@staff.main.ntu.edu.sg')) {
      logger.debug('User is not from NTU, redirect to Login');
      // Optionally, trigger sign-in here
      return {
        data: {
          user: null,
          eduquestUser: null
        },
        error: 'Please sign in with your NTU email account.'
      };
    }

    // Return the user and eduquest user
    return { data: { user: msalUser, eduquestUser } };
  }

  /**
   * Fetches the EduquestUser profile based on the username.
   */
  async getEduquestUser(username: string): Promise<EduquestUser | null> {
    try {
      const response: AxiosResponse<EduquestUser> = await authApi.get<EduquestUser>(`/api/eduquest-users/by_email/?email=${username.toUpperCase()}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await this.signInWithMsal();
        }
      }
      logger.error('Failed to fetch Eduquest User:', error);
      return null;
    }
  }

  /**
   * Initiates the sign-out process using MSAL.
   */
  async signOutMsal(): Promise<{ error?: string }> {
    try {
      handleLogout("redirect");
      localStorage.removeItem('access-token');
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing out', err);
      return { error: err.message };
    }
  }
}

export const authClient = new AuthClient();

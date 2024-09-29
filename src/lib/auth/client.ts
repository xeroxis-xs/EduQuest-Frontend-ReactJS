'use client';

import axios, { AxiosError, type AxiosResponse } from 'axios';
import { handleLoginRedirect, handleLogout, getToken, msalInstance } from "@/app/msal/msal";
import { logger } from '@/lib/default-logger';
import type { EduquestUser } from "@/types/eduquest-user";
import { type AccountInfo } from "@azure/msal-browser";

/**
 * Create a separate Axios instance for AuthClient to avoid circular dependencies.
 */
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Set up the request interceptor to use MSAL's getToken method
authApi.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      logger.warn('MSAL: No access token available for Auth API request.');
      // Optionally, you can handle the missing token scenario here
    }
    return config;
  },
  (error) => {
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
    const msalUser = msalInstance.getActiveAccount();
    if (!msalUser) {
      logger.warn('MSAL: No active user found');
      return {
        data: {
          user: null,
          eduquestUser: null
        }
      };
    }

    // Check if the email domain is allowed
    if (
      msalUser.username &&
      !msalUser.username.includes('@e.ntu.edu.sg') &&
      !msalUser.username.includes('@ntu.edu.sg') &&
      !msalUser.username.includes('@staff.main.ntu.edu.sg')
    ) {
      logger.debug('User is not from NTU, redirecting to login.');
      return {
        data: {
          user: null,
          eduquestUser: null
        },
        error: 'Please sign in with your NTU email account.'
      };
    }

    // Get the EduquestUser profile
    const eduquestUser = await this.getEduquestUser(msalUser.username);

    if (eduquestUser === null) {
      return {
        data: {
          user: null,
          eduquestUser: null
        },
        error: 'Failed to fetch user profile.'
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
      const response: AxiosResponse<EduquestUser> = await authApi.get<EduquestUser>(
        `/api/eduquest-users/by_email/?email=${encodeURIComponent(username.toUpperCase())}`
      );
      return response.data;
    } catch (error: unknown) {
      // if (error instanceof AxiosError) {
      //   if (error.response?.status === 401) {
      //     await this.signInWithMsal();
      //   }
      // }
      logger.error('Failed to fetch Eduquest User, redirecting to Login page:', error);
      return null;
    }
  }

  /**
   * Initiates the sign-out process using MSAL.
   */
  async signOutMsal(): Promise<{ error?: string }> {
    try {
      handleLogout('redirect');
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing out', err);
      return { error: err.message };
    }
  }
}

export const authClient = new AuthClient();

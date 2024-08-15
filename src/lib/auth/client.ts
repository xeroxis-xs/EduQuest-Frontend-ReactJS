'use client';

import {handleLoginRedirect, handleLogout, msalInstance} from "@/app/msal/msal";
import apiService from "@/api/api-service";
import { type AxiosResponse, AxiosError } from "axios";
import {type EduquestUser} from "@/types/eduquest-user";
import {logger} from '@/lib/default-logger';
import {type AccountInfo} from "@azure/msal-browser";


class AuthClient {

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
      // await this.signInWithMsal();
      return {
        data: {
          user: null,
          eduquestUser: null
        }
      };
    }

    const msalUser = msalInstance.getActiveAccount();
    const eduquestUser = await this.getEduquestUser(msalUser?.username ?? '');
    return { data: { user: msalUser, eduquestUser } };
  }

  async getEduquestUser(username: string): Promise<EduquestUser | null> {
    try {
      const response: AxiosResponse<EduquestUser> = await apiService.get<EduquestUser>(`/api/EduquestUser/${username.toUpperCase()}`);
      return response.data ;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to fetch Eduquest User: ', error);
      return null;
    }
  }

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

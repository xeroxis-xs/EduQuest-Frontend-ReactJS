'use client';

// import type { User } from '@/types/user';
import {
  // handleLogin,
  handleLogout,
  // getToken,
  msalInstance,
  // handleLoginPopupNew,
  handleLoginRedirectNew
} from "@/app/msal/msal";
import { logger } from '@/lib/default-logger';
import { type AccountInfo } from "@azure/msal-browser";

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies User;

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }
//
// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }
//
// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }
//
// export interface ResetPasswordParams {
//   email: string;
// }



class AuthClient {

  // async signUp(_: SignUpParams): Promise<{ error?: string }> {
  //   // Make API request
  //
  //   // We do not handle the API, so we'll just generate a token and store it in localStorage.
  //   const token = generateToken();
  //   localStorage.setItem('custom-auth-token', token);
  //
  //   return {};
  // }

  // async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
  //   return { error: 'Social authentication not implemented' };
  // }

  async signInWithMsal(): Promise<{ error?: string }> {
    // try {
    //   logger.debug('signInWithMsal');
    //   handleLogin("popup");
    //
    //   const token = await getToken();
    //   logger.debug('Token from signInWithMsal', token);
    //   if (token !== null) {
    //     logger.debug('Token set from signInWithMsal');
    //     localStorage.setItem('custom-auth-token', token);
    //   }
    //   return {};
    // } catch (error) {
    //   const err = error as Error;
    //   logger.error('Error signing in', err);
    //   return { error: err.message };
    // }
    try {
      // logger.debug('signInWithMsal');
      localStorage.removeItem('access-token');
      msalInstance.setActiveAccount(null);
      // const token = await getToken();
      // if (token !== null) {
      //   localStorage.setItem('access-token', token);
      // }
      await handleLoginRedirectNew();
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing in', err);
      return { error: err.message };
    }


    //   if (loginResponse) {
    //     console.log('loginResponse', loginResponse);
    //     // Acquire a token silently
    //     const tokenResponse = await msalInstance.acquireTokenSilent({
    //       account: msalInstance.getAllAccounts()[0],
    //       scopes: ["User.Read"]
    //     });
    //     if (tokenResponse) {
    //       console.log('tokenResponse', tokenResponse);
    //       // Store the access token in local storage
    //       localStorage.setItem('custom-auth-token', tokenResponse.accessToken);
    //     }
    //
    //   } else {
    //     return { error: 'No account returned' };
    //   }
    //   return {};
    // }
    // catch (error) {
    //   const err = error as Error;
    //   return { error: err.message };
    // }
  }

  // async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
  //   const { email, password } = params;
  //
  //   // Make API request
  //
  //   // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
  //   if (email !== 'sofia@devias.io' || password !== 'Secret1') {
  //     return { error: 'Invalid credentials' };
  //   }
  //
  //   const token = generateToken();
  //   localStorage.setItem('access-token', token);
  //
  //   return {};
  // }

  // async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Password reset not implemented' };
  // }
  //
  // async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Update reset not implemented' };
  // }

  async getUser(): Promise<{ data: AccountInfo | null; error?: string }> {
    // const response = await msalInstance.handleRedirectPromise();
    // if (response) {
    //   logger.debug("Redirect response:", response);
    //   if (response.account) {
    //     msalInstance.setActiveAccount(response.account);
    //     logger.debug("Active account set:", response.account);
    //   }
    // }
    // Make API request
    // logger.debug('getUser() CALLED!')
    const token = localStorage.getItem('access-token');
    logger.debug('access-token', token)

    if (token !== null) {

      const msalUser = msalInstance.getActiveAccount();
      // logger.debug('AccountInfo', msalUser);
      return { data: msalUser };
      // localStorage.setItem('custom-auth-token', token);
    }
    // logger.debug('No token found so return data null from getUser');
    return { data: null };
    // // We do not handle the API, so just check if we have a token in localStorage.
    // const token = localStorage.getItem('custom-auth-token');

    // if (!token) {
    //   logger.debug('getToken() No Token!, so return data null');
    //   return { data: null };
    // }
    // logger.debug('getToken() Have Token!, so return data user');
    // return { data: user };

    // const user = await getUser();
    // return { data: user };

  }

  // async signOut(): Promise<{ error?: string }> {
  //   localStorage.removeItem('access-token');
  //
  //   return {};
  // }

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

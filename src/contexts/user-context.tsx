'use client';

import * as React from 'react';

// import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { initializeMsal, msalInstance } from "@/app/msal/msal";
import { MsalProvider } from "@azure/msal-react";
import { type AccountInfo } from "@azure/msal-browser";

export interface UserContextValue {
  user: AccountInfo | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {

  const [state, setState] = React.useState<{ user: AccountInfo | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      // logger.debug("Initializing MSAL..");
      await initializeMsal();
      // logger.debug("MSAL initialized");
      // logger.debug('Checking session CALLED');
      const { data, error } = await authClient.getUser();
      if (error) {
        logger.error(error);
        setState((prev) => ({
            ...prev,
            user: null,
            error: 'Something went wrong',
            isLoading: false
          }));
        return;
      }

      setState((prev) => ({
        ...prev,
        user: data ?? null,
        error: null,
        isLoading: false
      }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({
        ...prev,
        user: null,
        error: 'Something went wrong',
        isLoading: false
      }));
    }
  }, []);

  React.useEffect(() => {

    // initializeMsal()
    //   .then(() => {
    //   logger.debug('MSAL initialized');
    // })
    //   .catch((err: unknown) => {
    //   logger.error(err);
    // })
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <UserContext.Provider value={{ ...state, checkSession }}>

        {children}

      </UserContext.Provider>
    </MsalProvider>
      );
}

export const UserConsumer = UserContext.Consumer;

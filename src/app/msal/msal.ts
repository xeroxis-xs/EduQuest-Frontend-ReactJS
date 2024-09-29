// msal.ts

import { AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./msal-config";
import { logger } from '@/lib/default-logger';

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initializes MSAL by handling redirect responses and setting the active account.
 */
export async function initializeMsal(): Promise<void> {
  logger.debug("MSAL: Initializing...");
  await msalInstance.initialize();
  try {
    // Handle redirect promise to process the response from loginRedirect
    const loginResponse: AuthenticationResult | null = await msalInstance.handleRedirectPromise();

    if (loginResponse && loginResponse.account !== null) {
      logger.debug("MSAL: Login response received");
      msalInstance.setActiveAccount(loginResponse.account);
      // await handleLoginResponse(loginResponse);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
        logger.debug("MSAL: Active account set");
      }
    }

    logger.debug("MSAL: Initialization complete.");
  } catch (error) {
    logger.error("MSAL: Initialization error:", error);
  }
}

// /**
//  * Handles the login response.
//  */
// export async function handleLoginResponse(loginResponse: AuthenticationResult): Promise<void> {
//   const account = loginResponse.account;
//   msalInstance.setActiveAccount(account);
//   // logger.debug("MSAL: Active account set:", account);
//   const token = await getToken();
//   if (token) {
//     logger.debug("MSAL: Token acquired:", token);
//   } else {
//     logger.warn("MSAL: No token acquired.");
//   }
// }

/**
 * Acquires a token silently, or triggers a login if necessary.
 */
export async function getToken(): Promise<string | null> {
  try {
    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
      // No active account, initiate login
      logger.warn("MSAL: No active account found, initiating login.");
      await handleLoginRedirect();
      return null;
    }

    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    });
    logger.debug("MSAL: Token acquired silently.");
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // Silent acquisition failed, initiate interactive login
      logger.warn('MSAL: Interaction required, redirecting to login.');
      await handleLoginRedirect();
    } else {
      logger.error('MSAL: Unexpected error acquiring token silently:', error);
    }
    return null;
  }
}

/**
 * Handles the login redirect process.
 */
export async function handleLoginRedirect(): Promise<void> {
  try {
    await msalInstance.loginRedirect(loginRequest);
    logger.debug("MSAL: Redirecting to login...");
  } catch (error) {
    logger.error("MSAL: Error during login redirect:", error);
  }
}

/**
 * Handles the logout process.
 */
export const handleLogout = (logoutType = "redirect"): void => {
  if (logoutType === "popup") {
    msalInstance.logoutPopup().catch((e: unknown) => {
      logger.error("MSAL: logoutPopup failed:", e);
    });
  } else if (logoutType === "redirect") {
    const logoutRequest = {
      account: msalInstance.getActiveAccount(),
      postLogoutRedirectUri: "/",
    };
    msalInstance.logoutRedirect(logoutRequest).catch((e: unknown) => {
      logger.error("MSAL: logoutRedirect failed:", e);
    });
  }
};

import { type AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
// import { getCurrentToken } from "./token-fetcher";
import { msalConfig, loginRequest } from "./msal-config";
import { logger } from '@/lib/default-logger';

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() : Promise<void>{
  logger.debug("MSAL: Initializing...");
  await msalInstance.initialize();
  logger.debug("MSAL: Initialized.")
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
  const loginResponse = await msalInstance.handleRedirectPromise();
  if (loginResponse !== null) {
    logger.debug("MSAL: Login response received");
    await handleLoginResponse(loginResponse);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    // Check if a user is already logged in
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const response = await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: [loginRequest.scopes[0]],
      });
      logger.debug("MSAL: Token acquired");
      return response.accessToken;
    }
    logger.debug('MSAL: No accounts found.');
    return null;
  } catch (error) {
    logger.error('MSAL: Token acquisition failed.', error);
    return null;
  }
}

export async function handleLoginResponse(loginResponse: AuthenticationResult): Promise<void> {
    const account = loginResponse.account;
    msalInstance.setActiveAccount(account);
    logger.debug("MSAL: Active account set:", account);
    const token = await getToken();
    if (token !== null) {
        localStorage.setItem('access-token', token);
      }
}


export async function handleLoginRedirect() : Promise<void>{
  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    logger.error("MSAL: Error handling login redirect: ", error);
  }
}

export const handleLogout = (logoutType = "redirect") => {
  if (logoutType === "popup") {
    msalInstance.logoutPopup().catch((e: unknown) => {
      logger.error("logoutPopup failed: ", e);
    });
  } else if (logoutType === "redirect") {
    const logoutRequest = {
      account: msalInstance.getActiveAccount(),
      postLogoutRedirectUri: "/",
    };
    msalInstance.logoutRedirect(logoutRequest).catch((e: unknown) => {
      logger.error("logoutRedirect failed: ", e);
    });
  }
};

import { type AuthenticationResult, PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { getCurrentToken } from "./token-fetcher";
import { msalConfig, loginRequest } from "./msal-config";
import { logger } from '@/lib/default-logger';

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() : Promise<void>{
  logger.debug("Initializing MSAL..");
  await msalInstance.initialize();
  logger.debug("MSAL initialized")
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  const loginResponse = await msalInstance.handleRedirectPromise();
  if (loginResponse !== null) {
    await handleLoginResponse(loginResponse);
  }

  // msalInstance.addEventCallback(async (event) => {
  //   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
  //     const payload = event.payload as AuthenticationResult;
  //     const account = payload.account;
  //     msalInstance.setActiveAccount(account);
  //     logger.debug("Event callback, active account set:", account);
  //
  //   }
  // });


}

export async function getToken(): Promise<string | null>{
  const authToken = await getCurrentToken(msalInstance);
  logger.debug("AUTH TOKEN:", authToken);

  return authToken;
}

export async function getUser() :Promise<AccountInfo | null> {
  const user = msalInstance.getActiveAccount();
  logger.debug("USER:", user);
  return user;
}

export const handleLogin = (loginType = "redirect") => {
  if (loginType === "popup") {
    msalInstance.loginPopup().catch((e: unknown) => {
      logger.error("loginPopup failed: ", e);
    });
  } else if (loginType === "redirect") {
    msalInstance.loginRedirect().catch((e: unknown) => {
      logger.error("loginRedirect failed: ", e);
    });
  }
};

export async function handleLoginResponse(loginResponse: AuthenticationResult): Promise<void> {
    const account = loginResponse.account;
    msalInstance.setActiveAccount(account);
    logger.debug("Active account set:", account);
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: msalInstance.getAllAccounts()[0],
      scopes: [loginRequest.scopes[0]]
    });
    if (tokenResponse !== null) {
        localStorage.setItem('custom-auth-token', tokenResponse.accessToken);
      }
}


export async function handleLoginPopupNew(): Promise<void> {
  const loginResponse = await msalInstance.loginPopup(loginRequest);
  if (loginResponse) {
    await handleLoginResponse(loginResponse);
  }
}

export async function handleLoginRedirectNew() : Promise<void>{
  await msalInstance.loginRedirect(loginRequest);
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

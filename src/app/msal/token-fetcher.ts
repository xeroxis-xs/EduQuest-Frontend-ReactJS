import { type PublicClientApplication } from "@azure/msal-browser";
import { API_SCOPE } from "./msal-config";
import { logger } from '@/lib/default-logger';

export async function getCurrentToken(msalInstance: PublicClientApplication): Promise<string | null> {
    const acquireAccessToken = async () => {
        const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
        const accounts = msalInstance.getAllAccounts();

        if (!activeAccount && accounts.length === 0) {
            /*
            * User is not signed in. Throw error or wait for user to login.
            * Do not attempt to log a user in outside the context of MsalProvider
            */
            return null;
        }
        const request = {
            scopes: [API_SCOPE],
            account: activeAccount || accounts[0]
        };

        try {
            const authResult = await msalInstance.acquireTokenSilent(request);
            return authResult.accessToken;
        } catch (error) {
            // If silent acquisition fails, try acquiring token through popup or redirect
            try {
                const authResult = await msalInstance.acquireTokenPopup(request);
                return authResult.accessToken;
            } catch (error1) {
              logger.error("Error acquiring token:", error1);
                return null;
            }
        }
    };

  let token = null;

  if (typeof window !== 'undefined') {
        token = await acquireAccessToken();
    }

    return token;
}

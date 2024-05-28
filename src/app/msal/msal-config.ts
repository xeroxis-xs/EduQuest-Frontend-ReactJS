const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI;

if (!clientId || !redirectUri) {
  throw new Error('Environment variables NEXT_PUBLIC_AZURE_CLIENT_ID and NEXT_PUBLIC_AZURE_REDIRECT_URI must be set');
}

export const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/common`,
    redirectUri
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to true if you are having issues on IE11 or Edge
  },
};

export const API_SCOPE = "User.ReadBasic.All";

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [API_SCOPE]
};

export const userDataLoginRequest = {
  scopes: [API_SCOPE]
};
/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

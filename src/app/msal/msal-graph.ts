import {graphConfig, userDataLoginRequest} from "@/app/msal/msal-config";
// import Error from "next/error";
import {msalInstance} from '@/app/msal/msal';
import {type AccountInfo, type AuthenticationResult, type SilentRequest} from "@azure/msal-browser";
import {logger} from '@/lib/default-logger';

export async function getUserPhotoAvatar(): Promise<string> {
  const instance = msalInstance;
  const account: AccountInfo | null = instance.getActiveAccount();

  if (!account) {
    throw new Error("No active account! Verify a user has been signed in and setActiveAccount has been called."); // Modified this line
  }

  const request: SilentRequest = {
    ...userDataLoginRequest,
    account,
  };

  const tokenResponse: AuthenticationResult = await instance.acquireTokenSilent(request);

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${tokenResponse.accessToken}`);

  const photoEndpoint = `${graphConfig.graphMeEndpoint}/photo/$value`;

  const options = {
    method: "GET",
    headers,
  };

  return fetch(photoEndpoint, options)
    .then((response) => response.blob())
    .then((blob) => {
      return URL.createObjectURL(blob);
    })
    .catch((error: unknown) => {
      logger.error(error);
      return '';
    });
}

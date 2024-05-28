'use client'
import {type AccountInfo} from "@azure/msal-browser";
import {msalInstance} from "./msal";

export function getLoggedInUser(): AccountInfo | null {
  return msalInstance?.getActiveAccount();
}

export function getUserClaims(account?: AccountInfo | null): string[] {
    let userAccount = account;
    if (!userAccount) {
        userAccount = getLoggedInUser();
    }

    return userAccount?.idTokenClaims?.roles ?? [];
}

export function isUserAllowed(requiredRole: string, account?: AccountInfo | null, claims?: string[] | null): boolean {
    let userClaims = claims;

    if (!userClaims) {
        userClaims = getUserClaims(account);
    }

    return userClaims ? userClaims.includes(requiredRole) : false;
}

export function extractInitials(name: string | null | undefined): string {
  if (!name) return '';

  const ignoreList = ["ext"]; // titles to ignore

  // Remove the starting and ending #
  const cleanedName = name.replace(/^#|#$/g, '');

  return cleanedName
    .split(' ')
    .filter(part => !ignoreList.includes(part.toLowerCase()))
    .map(part => part.trim())
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

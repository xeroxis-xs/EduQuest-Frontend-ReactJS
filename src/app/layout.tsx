'use client'

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
// import { initializeMsal, msalInstance } from "@/app/msal/msal";
// import { MsalProvider } from "@azure/msal-react";
// import MyMsalProvider from "@/components/auth/msal-provider";

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  // console.log("Layout");
  // React.useEffect(() => {
  //
  //   initializeMsal();
  // }, []);
  return (
    <html lang="en">
      <body>
      {/*<MyMsalProvider>*/}
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      {/*</MyMsalProvider>*/}

      </body>
    </html>
  );
}

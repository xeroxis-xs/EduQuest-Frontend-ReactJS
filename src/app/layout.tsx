'use client'

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {

  return (
    <html lang="en">
    <head>
      <link href="/assets/favicon.ico" rel="icon"/>
      <link href="/assets/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png"/>
      <link href="/assets/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png"/>
      <link href="/assets/android-chrome-192x192.png" rel="icon" sizes="192x192" type="image/png"/>
      <link href="/assets/android-chrome-512x512.png" rel="icon" sizes="512x512" type="image/png"/>
      <link href="/assets/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180"/>
      <title>EduQuest</title>
    </head>
    <body>

    <LocalizationProvider>
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
    </LocalizationProvider>

    </body>
    </html>
  );
}

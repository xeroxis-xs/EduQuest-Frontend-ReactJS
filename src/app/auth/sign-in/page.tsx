'use client';

import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignInForm } from '@/components/auth/sign-in-form';


export default function Page(): React.JSX.Element {
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Layout>
      <GuestGuard onError={setError}>
        <SignInForm error={error}/>
      </GuestGuard>
    </Layout>
  );
}

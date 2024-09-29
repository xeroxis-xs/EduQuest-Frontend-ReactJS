'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
// import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { Verifying } from '@/components/dashboard/loading/veryfying';

export interface GuestGuardProps {
  children: React.ReactNode;
  onError?: (error: string) => void;
}

export function GuestGuard({ children, onError }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      if (onError) {
        onError(error);
      }
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
      router.replace(paths.dashboard.overview);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return (
      <Verifying/>
    );
  }

  // if (error) {
  //   return <Alert severity="error">{error}</Alert>;
  // }

  return <React.Fragment>{children}</React.Fragment>;
}

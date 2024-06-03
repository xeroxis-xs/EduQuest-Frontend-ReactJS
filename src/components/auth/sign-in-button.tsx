'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { MicrosoftOutlookLogo } from '@phosphor-icons/react/dist/ssr/MicrosoftOutlookLogo';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

export function SignInButton(): React.JSX.Element {

  const router = useRouter();
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const onSubmit = React.useCallback(
    async (): Promise<void> => {
      setIsPending(true);
      await authClient.signInWithMsal();

      // Refresh the auth state
      await checkSession?.();
      // router.replace(paths.dashboard.overview);
      router.refresh();
    },
      [checkSession, router]
  );

  return (
    <Button
      startIcon={<MicrosoftOutlookLogo size="34px" weight="fill"/>}
      disabled={isPending}
      variant="contained"
      onClick={onSubmit}
      sx={{ fontSize: '20px', padding: '20px' }}
    >
      Login with NTU Account
    </Button>
  );
}

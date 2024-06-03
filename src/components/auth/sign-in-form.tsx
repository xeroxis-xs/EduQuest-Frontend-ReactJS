import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SignInButton } from '@/components/auth/sign-in-button';

export function SignInForm(): React.JSX.Element {

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <SignInButton />
      </Stack>
      <Stack spacing={2}>
      <Alert color="warning">
        Only users with {' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          NTU 365 Account
        </Typography>{' '}
        have access to this site.

      </Alert>
      </Stack>
    </Stack>
  );
}

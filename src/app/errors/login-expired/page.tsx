import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { SignInButton } from '@/components/auth/sign-in-button';


import { config } from '@/config';
import { paths } from '@/paths';

export const metadata = { title: `Unauthorised | Errors | ${config.site.name}` } satisfies Metadata;

export default function LoginExpired(): React.JSX.Element {
  return (
    <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
      <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
        <Box>
          <Box
            component="img"
            alt="Under development"
            src="/assets/error-404.png"
            sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          401: You are unauthorised to view this page or your login has expired.
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          Please try to login again.
        </Typography>
        <Button
          component={RouterLink}
          href={paths.auth.signIn}
          startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
        >
          Back to Login
        </Button>
        {/*<SignInButton />*/}
      </Stack>
    </Box>
  );
}

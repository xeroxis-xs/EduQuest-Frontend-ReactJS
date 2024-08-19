'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SignInButton } from '@/components/auth/sign-in-button';
import { useTheme } from '@mui/material/styles';
import { CheckSquareOffset as CheckSquareOffsetIcon } from "@phosphor-icons/react/dist/ssr/CheckSquareOffset";
import { Ranking as RankingIcon } from "@phosphor-icons/react/dist/ssr/Ranking";
import { Medal as MedalIcon } from "@phosphor-icons/react/dist/ssr/Medal";

import Box from "@mui/material/Box";

export function SignInForm(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Stack spacing={4} >
      <Typography align="center" variant="h6">
        Welcome to EduQuest!
      </Typography>
      <Typography align="center" variant="body1">
        A platform for you to learn and earn.
      </Typography>
      <SignInButton />
      <Alert severity="info">
        Only users with {' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          NTU 365 Account
        </Typography>{' '}
        have access to this site.
      </Alert>

      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Stack component="ul" direction="row" spacing={2} style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 0, justifyContent: 'space-evenly', width: '100%' }}>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <CheckSquareOffsetIcon size={20} style={{ flexShrink: 0, marginRight: '8px' }} color={theme.palette.primary.main} />
            <Typography variant="body1">Complete</Typography>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <RankingIcon size={20} style={{ flexShrink: 0, marginRight: '8px' }} color={theme.palette.primary.main} />
            <Typography variant="body1">Compete</Typography>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <MedalIcon size={20} style={{ flexShrink: 0, marginRight: '8px' }} color={theme.palette.primary.main} />
            <Typography variant="body1">Collect</Typography>
          </li>
        </Stack>
      </Box>


    </Stack>
  );
}

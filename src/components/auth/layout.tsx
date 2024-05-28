import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ListChecks, Crown, Trophy } from "@phosphor-icons/react/dist/ssr";

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={45} width={170} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Welcome to{' '}
              <Box component="span" sx={{ color: '#15b79e' }}>
                EduQuest
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1">
              A platform to for students to learn and earn!
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <ListChecks size={28}  />
              <Typography align="center" variant="subtitle1" sx={{ marginLeft: '8px' }}>
                Complete
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Crown size={28} />
            <Typography align="center" variant="subtitle1" sx={{ marginLeft: '8px' }}>
               Conquer
            </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Trophy size={28} />
            <Typography align="center" variant="subtitle1" sx={{ marginLeft: '8px' }}>
               Collect
            </Typography>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              alt="Widgets"
              src="/assets/auth-widgets.png"
              sx={{ height: 'auto', width: '100%', maxWidth: '600px' }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';
import { metadata as dashboardMetadata } from '@/app/dashboard/metadata';
import type { Metadata } from 'next';
import { Footer } from '@/components/core/footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = dashboardMetadata;

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            margin: 0,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-level1)',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto',
        }}
      >
        <SideNav />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '64px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
      <Box sx={{ pl: { lg: 'var(--SideNav-width)' }, bgcolor: 'var(--mui-palette-background-level1)' }}>
        <Footer />
      </Box>
    </AuthGuard>
  );
}

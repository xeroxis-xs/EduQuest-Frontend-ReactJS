export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    wooclap: '/dashboard/wooclap',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: {
    notFound: '/errors/not-found',
    loginExpired: '/errors/login-expired',
  },
} as const;
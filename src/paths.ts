export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
  },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    user: '/dashboard/eduquest-user',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    course: '/dashboard/course',
    quest: '/dashboard/quest',
    generator: '/dashboard/generator',
    import: '/dashboard/import',
    badge: {
      catalogue: '/dashboard/badge/badge-catalogue',
      my: '/dashboard/badge/my-badge',
    },
  },
  errors: {
    notFound: '/errors/not-found',
  },
} as const;

export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
  },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    // customers: '/dashboard/customers',
    // user: '/dashboard/eduquest-user',
    // integrations: '/dashboard/integrations',
    // settings: '/dashboard/settings',
    course: '/dashboard/course',
    quest: '/dashboard/quest',
    generator: {
      upload: '/dashboard/generator/my-upload',
      quest: '/dashboard/generator/my-quest',
    },
    import: '/dashboard/import',
    badge: {
      catalogue: '/dashboard/badge/badge-catalogue',
      my: '/dashboard/badge/my-badge',
    },
    feedback: '/dashboard/feedback'
  },
  errors: {
    notFound: '/errors/not-found',
  },
} as const;

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    key: 'course',
    title: 'Courses',
    href: paths.dashboard.course,
    icon: 'book',
    matcher: {type: 'startsWith', href: paths.dashboard.course}
  },
  {
    key: 'quest',
    title: 'Quests',
    href: paths.dashboard.quest,
    icon: 'sword',
    matcher: { type: 'startsWith', href: paths.dashboard.quest },
  },
  {
    key: 'badge',
    title: 'Badge',
    icon: 'badge',
    items: [
      {
        key: 'badge-catalogue',
        title: 'Badge Catalogue',
        href: paths.dashboard.badge.catalogue
      },
      {
        key: 'my-badges',
        title: 'My Badges',
        href: paths.dashboard.badge.my
      }
    ]
  },
  {
    key: 'generator',
    title: 'Quest Generator',
    href: paths.dashboard.generator,
    icon: 'magic-wand',
    matcher: { type: 'startsWith', href: paths.dashboard.generator },
  },
  {
    key: 'import',
    title: 'Import',
    href: paths.dashboard.import,
    icon: 'upload',
    matcher: { type: 'startsWith', href: paths.dashboard.import },
  },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'eduquest-user', title: 'Eduquest Users', href: paths.dashboard.user, icon: 'users' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },

] satisfies NavItemConfig[];

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'course', title: 'Courses', href: paths.dashboard.course, icon: 'book' },
  { key: 'quest', title: 'Quests', href: paths.dashboard.quest, icon: 'sword' },
  { key: 'badge', title: 'Badge', href: paths.dashboard.badge, icon: 'badge' },
  { key: 'generator', title: 'Quest Generator', href: paths.dashboard.generator, icon: 'magic-wand' },
  { key: 'import', title: 'Import', href: paths.dashboard.import, icon: 'upload' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'eduquest-user', title: 'Eduquest Users', href: paths.dashboard.user, icon: 'users' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },

] satisfies NavItemConfig[];

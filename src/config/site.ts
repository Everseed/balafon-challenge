import { type Language } from './languages';
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Lingo',
  description: 'This is your place.Explore. Learn. Build. Grow.',
  getHeaderLinks: (isLoggedIn: boolean) => {
    const items = [
      {
        title: 'Challenge',
        href: '/challenge'
      },
      {
        title: 'Leaderboard',
        href: '/leaderboard'
      }
    ];

    if (isLoggedIn) {
      items.push({
        title: 'Add Snippet',
        href: '/add-snippet'
      });
    }

    items.push({
      title: 'Contributors',
      href: '/contributors'
    });

    return items;
  }
};

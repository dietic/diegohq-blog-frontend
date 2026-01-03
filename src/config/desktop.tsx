/**
 * Desktop Configuration
 *
 * To add a new icon:
 * 1. Import your window component
 * 2. Add an entry to the appropriate array:
 *    - PUBLIC_ICONS: Visible to all users (logged in or not)
 *    - AUTH_ICONS: Only visible when logged in
 *    - GUEST_ICONS: Only visible when logged out
 *
 * Internal windows: provide `window` (component) and `windowTitle`
 * External links: provide `externalUrl`
 */

import type { ReactNode } from 'react';
import {
  JournalWindow,
  InventoryWindow,
  QuestLogWindow,
  ProfileWindow,
  LoginWindow,
  SignupWindow,
  AboutWindow,
  ContactWindow,
} from '@/components/WindowContent';

// ============================================
// Types
// ============================================

interface BaseIcon {
  id: string;
  label: string;
  icon: string;
  position: { x: number; y: number };
}

interface InternalIcon extends BaseIcon {
  windowTitle: string;
  window: (props: DesktopDataProps) => ReactNode;
  externalUrl?: never;
}

interface ExternalIcon extends BaseIcon {
  externalUrl: string;
  windowTitle?: never;
  window?: never;
}

export type DesktopIconConfig = InternalIcon | ExternalIcon;

// Props passed to internal window components (used internally for window config)
interface DesktopDataProps {
  posts: unknown[];
  quests: unknown[];
  items: unknown[];
  onOpenPost: (slug: string) => void;
  onOpenWindow?: (id: string) => void;
}

// ============================================
// Icon Definitions
// ============================================

const PUBLIC_ICONS: DesktopIconConfig[] = [
  {
    id: 'about',
    label: 'About',
    icon: '/desktop-icons/map.png',
    position: { x: 0, y: 0 },
    windowTitle: 'About Us',
    window: () => <AboutWindow />,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '/desktop-icons/letter.png',
    position: { x: 0, y: 1 },
    windowTitle: 'Contact Us',
    window: () => <ContactWindow />,
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: '/desktop-icons/discord.png',
    position: { x: 0, y: 2 },
    externalUrl: 'https://discord.gg/placeholder',
  },
];

const GUEST_ICONS: DesktopIconConfig[] = [
  {
    id: 'journal',
    label: 'Journal',
    icon: '/desktop-icons/book.png',
    position: { x: 0, y: 0 },
    windowTitle: 'Journal',
    window: ({ posts, onOpenPost }) => (
      <JournalWindow posts={posts as any} onOpenPost={onOpenPost} />
    ),
  },
  {
    id: 'login',
    label: 'Login',
    icon: '/desktop-icons/person.png',
    position: { x: 0, y: 1 },
    windowTitle: 'Login',
    window: ({ onOpenWindow }) => (
      <LoginWindow
        onSuccess={() => {
          // Window will close and icons will update via auth context
        }}
        onSwitchToSignup={() => onOpenWindow?.('signup')}
      />
    ),
  },
  {
    id: 'signup',
    label: 'Sign Up',
    icon: '/desktop-icons/ink.png',
    position: { x: 0, y: 2 },
    windowTitle: 'Create Account',
    window: ({ onOpenWindow }) => (
      <SignupWindow
        onSuccess={() => {
          // Window will close and icons will update via auth context
        }}
        onSwitchToLogin={() => onOpenWindow?.('login')}
      />
    ),
  },
];

const AUTH_ICONS: DesktopIconConfig[] = [
  {
    id: 'journal',
    label: 'Journal',
    icon: '/desktop-icons/book.png',
    position: { x: 0, y: 0 },
    windowTitle: 'Journal',
    window: ({ posts, onOpenPost }) => (
      <JournalWindow posts={posts as any} onOpenPost={onOpenPost} />
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '/desktop-icons/chest.png',
    position: { x: 0, y: 1 },
    windowTitle: 'Inventory',
    window: ({ items }) => <InventoryWindow items={items as any} />,
  },
  {
    id: 'quests',
    label: 'Quests',
    icon: '/desktop-icons/sword.png',
    position: { x: 0, y: 2 },
    windowTitle: 'Quest Log',
    window: ({ quests }) => <QuestLogWindow quests={quests as any} />,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '/desktop-icons/person.png',
    position: { x: 0, y: 3 },
    windowTitle: 'Player Profile',
    window: () => <ProfileWindow />,
  },
];

// ============================================
// Combined getter for visible icons
// ============================================

export function getVisibleIcons(isAuthenticated: boolean): DesktopIconConfig[] {
  if (isAuthenticated) {
    // Logged in: Discord at position 3 (y:2), shift Quests/Profile down
    const shiftedAuthIcons = AUTH_ICONS.map((icon) => {
      if (icon.position.y >= 2) {
        return { ...icon, position: { ...icon.position, y: icon.position.y + 1 } };
      }
      return icon;
    });

    const discord = PUBLIC_ICONS.find((i) => i.id === 'discord');
    const otherPublicIcons = PUBLIC_ICONS.filter((i) => i.id !== 'discord').map(
      (icon, index) => ({
        ...icon,
        position: { x: 0, y: 5 + index },
      })
    );

    const discordAtPosition2 = discord
      ? [{ ...discord, position: { x: 0, y: 2 } }]
      : [];

    return [...shiftedAuthIcons, ...discordAtPosition2, ...otherPublicIcons];
  }

  // Guest layout: Journal, Login, SignUp, About, Contact, Discord
  // Shift public icons to come after guest icons
  const shiftedPublicIcons = PUBLIC_ICONS.map((icon, index) => ({
    ...icon,
    position: { x: 0, y: 3 + index }, // Start at y:3 (after Journal, Login, SignUp)
  }));

  return [...GUEST_ICONS, ...shiftedPublicIcons];
}

// ============================================
// Helpers
// ============================================

const DESKTOP_GRID = {
  iconSize: 64,
  iconSpacing: 100,
  startX: 24,
  startY: 24,
};

export function getIconPosition(gridX: number, gridY: number) {
  return {
    x: DESKTOP_GRID.startX + gridX * DESKTOP_GRID.iconSpacing,
    y: DESKTOP_GRID.startY + gridY * DESKTOP_GRID.iconSpacing,
  };
}

export function isExternalIcon(icon: DesktopIconConfig): icon is ExternalIcon {
  return 'externalUrl' in icon && !!icon.externalUrl;
}

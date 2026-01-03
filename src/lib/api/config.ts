/**
 * API configuration for backend communication
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  // Public content
  content: {
    posts: '/content/posts',
    postBySlug: (slug: string) => `/content/posts/${slug}`,
    featuredPosts: '/content/posts/featured',
    postsByPillar: (pillar: string) => `/content/posts/pillar/${pillar}`,
    postsByTag: (tag: string) => `/content/posts/tag/${tag}`,
    quests: '/content/quests',
    questById: (id: string) => `/content/quests/${id}`,
    questsByPost: (slug: string) => `/content/quests/post/${slug}`,
    items: '/content/items',
    itemById: (id: string) => `/content/items/${id}`,
    itemsByRarity: (rarity: string) => `/content/items/rarity/${rarity}`,
    desktopIcons: '/content/desktop/icons',
    desktopIconById: (id: string) => `/content/desktop/icons/${id}`,
    desktopSettings: '/content/desktop/settings',
    windows: '/content/windows',
    windowById: (id: string) => `/content/windows/${id}`,
  },
  // Admin content
  admin: {
    posts: '/admin/content/posts',
    postBySlug: (slug: string) => `/admin/content/posts/${slug}`,
    publishPost: (slug: string) => `/admin/content/posts/${slug}/publish`,
    unpublishPost: (slug: string) => `/admin/content/posts/${slug}/unpublish`,
    quests: '/admin/content/quests',
    questById: (id: string) => `/admin/content/quests/${id}`,
    items: '/admin/content/items',
    itemById: (id: string) => `/admin/content/items/${id}`,
    desktopIcons: '/admin/content/desktop/icons',
    desktopIconById: (id: string) => `/admin/content/desktop/icons/${id}`,
    reorderIcons: '/admin/content/desktop/icons/reorder',
    desktopSettings: '/admin/content/desktop/settings',
    windows: '/admin/content/windows',
    windowById: (id: string) => `/admin/content/windows/${id}`,
  },
} as const;

# Custom CMS Architecture

This document outlines the architecture and implementation plan for the custom Content Management System built specifically for "The Adventurer's Journal." Unlike third-party solutions (Keystatic, Refine, Contentful), our custom CMS is designed from the ground up to integrate seamlessly with the gamification mechanics.

---

## 1. Overview

### Why Build a Custom CMS?

1. **Gamification-First Design:** Native support for XP rewards, level-gating, item-gating, and quests without awkward workarounds.
2. **Full Control:** No dependency on third-party services or their pricing/limitations.
3. **Git-Based Content:** All content lives in the repository as MDX files, enabling version control, code review for content, and simple deployment.
4. **Type Safety:** TypeScript schemas with Zod validation ensure content integrity at build time.
5. **Custom Admin UI:** The admin interface is a "window" within the OS, maintaining the retro aesthetic.

### Architecture Summary

| Layer               | Technology              | Description                                        |
| ------------------- | ----------------------- | -------------------------------------------------- |
| **Content Storage** | MDX files in `content/` | Git-tracked, Markdown with JSX support             |
| **Content Schemas** | Zod + TypeScript        | Type-safe frontmatter validation                   |
| **Content API**     | Next.js Server Actions  | File system operations, no database needed         |
| **Admin UI**        | Custom React components | Protected route at `/admin`, renders in-OS window  |
| **MDX Rendering**   | `next-mdx-remote`       | Server-side MDX compilation with custom components |

---

## 2. Content Directory Structure

```
content/
├── desktop/                        # Desktop configuration
│   ├── icons.json                  # All desktop icons and their positions
│   └── windows/                    # Custom window content (MDX)
│       ├── about.mdx               # "About" window content
│       ├── settings.mdx            # Settings/preferences content
│       └── help.mdx                # Help documentation
├── posts/                          # Journal entries (blog posts)
│   ├── intro-to-git.mdx
│   ├── understanding-github.mdx
│   └── intro-to-pull-requests.mdx
├── quests/                         # Quest definitions (JSON)
│   ├── the-first-chronicler.json
│   ├── cloud-ascendant.json
│   └── terminal-master.json
├── items/                          # Item definitions (JSON)
│   ├── map-to-cloud-kingdom.json
│   ├── collaboration-pendant.json
│   └── terminal-key.json
└── _schemas/                       # Reference schemas (for documentation)
    ├── desktop-icon.schema.json
    ├── window.schema.json
    ├── post.schema.json
    ├── quest.schema.json
    └── item.schema.json
```

---

## 3. Content Schemas (TypeScript + Zod)

All content types are validated at build time and runtime using Zod schemas.

### 3.1. Post Schema

```typescript
// src/lib/content/schemas/post.ts
import { z } from 'zod';

export const ContentPillarSchema = z.enum([
  'programming',
  'growth-career',
  'saas-journey',
]);

export const TargetLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

export const PostFrontmatterSchema = z.object({
  // Core metadata
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300),
  date: z.string().datetime(),
  author: z.string().default('Diego'),

  // Content categorization
  contentPillar: ContentPillarSchema,
  targetLevel: TargetLevelSchema,
  tags: z.array(z.string()).optional(),

  // Gamification - Gating
  requiredLevel: z.number().int().min(1).optional(),
  requiredItem: z.string().optional(), // Item slug
  challengeText: z.string().optional(), // Shown when item-gated

  // Gamification - Rewards
  readXp: z.number().int().min(0).default(10),
  questId: z.string().optional(), // Linked quest slug

  // SEO
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional(),

  // Publishing
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface Post extends PostFrontmatter {
  content: string; // Raw MDX content (body)
  readingTime: number; // Calculated field
}
```

### 3.2. Quest Schema

```typescript
// src/lib/content/schemas/quest.ts
import { z } from 'zod';

export const QuestTypeSchema = z.enum([
  'multiple-choice',
  'text-input',
  'call-to-action',
]);

export const QuestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500),

  // Quest content
  prompt: z.string(),
  type: QuestTypeSchema,
  options: z.array(z.string()).optional(), // For multiple-choice
  correctAnswer: z.string().optional(), // For validation

  // Rewards
  xpReward: z.number().int().min(1),
  itemReward: z.string().optional(), // Item slug to award

  // Relationships
  hostPostSlug: z.string(), // Post this quest appears in

  // Metadata
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
});

export type Quest = z.infer<typeof QuestSchema>;
```

### 3.3. Item Schema

```typescript
// src/lib/content/schemas/item.ts
import { z } from 'zod';

export const ItemRaritySchema = z.enum([
  'common',
  'uncommon',
  'rare',
  'legendary',
]);

export const ItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(50),
  description: z.string().max(200),

  // Display
  icon: z.string(), // Path to icon image
  rarity: ItemRaritySchema.default('common'),

  // Flavor
  flavorText: z.string().max(150).optional(), // "A weathered map..."
});

export type Item = z.infer<typeof ItemSchema>;
```

### 3.4. Desktop Icon Schema

```typescript
// src/lib/content/schemas/desktop-icon.ts
import { z } from 'zod';

export const WindowTypeSchema = z.enum([
  'journal', // Built-in: Journal/blog post list
  'quest-log', // Built-in: Quest tracking
  'inventory', // Built-in: User's items
  'profile', // Built-in: User profile/stats
  'settings', // Built-in: OS settings
  'custom', // Custom MDX content window
  'external', // External link (opens in new tab)
]);

export const DesktopIconSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1).max(20), // Display name under icon
  icon: z.string(), // Path to icon image (e.g., "/desktop-icons/book.png")

  // Position on desktop (grid-based or pixel coordinates)
  position: z.object({
    x: z.number().int().min(0), // Grid column or pixel X
    y: z.number().int().min(0), // Grid row or pixel Y
  }),

  // What happens when double-clicked
  windowType: WindowTypeSchema,
  windowId: z.string().optional(), // For 'custom' type: references content/desktop/windows/{id}.mdx
  externalUrl: z.string().url().optional(), // For 'external' type

  // Window configuration
  windowConfig: z
    .object({
      title: z.string().optional(), // Window title (defaults to icon label)
      defaultWidth: z.number().int().min(200).default(600),
      defaultHeight: z.number().int().min(150).default(400),
      minWidth: z.number().int().min(100).optional(),
      minHeight: z.number().int().min(100).optional(),
      resizable: z.boolean().default(true),
      maximizable: z.boolean().default(true),
    })
    .optional(),

  // Visibility/Gating
  requiredLevel: z.number().int().min(1).optional(), // Level required to see this icon
  requiredItem: z.string().optional(), // Item required to unlock
  visible: z.boolean().default(true), // Can be hidden from desktop

  // Ordering
  order: z.number().int().default(0), // Sort order for icon arrangement
});

export type DesktopIcon = z.infer<typeof DesktopIconSchema>;

// The icons.json file contains an array of DesktopIcons
export const DesktopIconsFileSchema = z.object({
  icons: z.array(DesktopIconSchema),

  // Desktop-wide settings
  settings: z
    .object({
      gridSize: z.number().int().default(80), // Grid cell size in pixels
      iconSpacing: z.number().int().default(16), // Space between icons
      startPosition: z
        .object({
          // Where first icon appears
          x: z.number().int().default(20),
          y: z.number().int().default(20),
        })
        .optional(),
    })
    .optional(),
});

export type DesktopIconsFile = z.infer<typeof DesktopIconsFileSchema>;
```

### 3.5. Custom Window Content Schema

```typescript
// src/lib/content/schemas/window.ts
import { z } from 'zod';

export const WindowContentFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(50),

  // Optional icon for the window header
  icon: z.string().optional(),

  // Default window dimensions
  defaultWidth: z.number().int().min(200).default(600),
  defaultHeight: z.number().int().min(150).default(400),

  // Behavior
  singleton: z.boolean().default(true), // Only one instance allowed
  closable: z.boolean().default(true),
  minimizable: z.boolean().default(true),
  maximizable: z.boolean().default(true),

  // Gating (can also be gated at icon level)
  requiredLevel: z.number().int().min(1).optional(),
  requiredItem: z.string().optional(),
});

export type WindowContentFrontmatter = z.infer<
  typeof WindowContentFrontmatterSchema
>;

export interface WindowContent extends WindowContentFrontmatter {
  content: string; // Raw MDX content (body)
}
```

---

## 4. Content API (`src/lib/content/`)

The content API provides functions to read, parse, and query content from the file system.

### 4.1. File Structure

```
src/lib/content/
├── index.ts              # Public exports
├── schemas/
│   ├── post.ts
│   ├── quest.ts
│   ├── item.ts
│   ├── desktop-icon.ts   # Desktop icons configuration
│   └── window.ts         # Custom window content
├── api/
│   ├── posts.ts          # Post CRUD operations
│   ├── quests.ts         # Quest CRUD operations
│   ├── items.ts          # Item CRUD operations
│   ├── desktop.ts        # Desktop icons & windows
│   └── windows.ts        # Custom window content
├── utils/
│   ├── mdx.ts            # MDX parsing utilities
│   ├── reading-time.ts   # Calculate reading time
│   └── fs-helpers.ts     # File system helpers
└── types.ts              # Shared types
```

### 4.2. Core API Functions

```typescript
// src/lib/content/api/posts.ts

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { PostFrontmatterSchema, Post } from '../schemas/post';
import { calculateReadingTime } from '../utils/reading-time';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

/**
 * Get all published posts, sorted by date (newest first)
 */
export async function getAllPosts(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Validate frontmatter
      const frontmatter = PostFrontmatterSchema.parse(data);

      return {
        ...frontmatter,
        content,
        readingTime: calculateReadingTime(content),
      };
    })
  );

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = PostFrontmatterSchema.parse(data);

    return {
      ...frontmatter,
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}

/**
 * Get posts by content pillar
 */
export async function getPostsByPillar(pillar: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.contentPillar === pillar);
}

/**
 * Get posts that are accessible to a user at a given level with given items
 */
export async function getAccessiblePosts(
  userLevel: number,
  userItems: string[]
): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts.filter((post) => {
    // Check level requirement
    if (post.requiredLevel && userLevel < post.requiredLevel) {
      return false;
    }
    // Check item requirement
    if (post.requiredItem && !userItems.includes(post.requiredItem)) {
      return false;
    }
    return true;
  });
}

/**
 * Get posts that are locked for a user (for UI display)
 */
export async function getLockedPosts(
  userLevel: number,
  userItems: string[]
): Promise<{ post: Post; reason: 'level' | 'item' }[]> {
  const allPosts = await getAllPosts();

  return allPosts
    .filter((post) => {
      if (post.requiredLevel && userLevel < post.requiredLevel) return true;
      if (post.requiredItem && !userItems.includes(post.requiredItem))
        return true;
      return false;
    })
    .map((post) => ({
      post,
      reason:
        post.requiredLevel && userLevel < post.requiredLevel ? 'level' : 'item',
    }));
}
```

### 4.3. Quest & Item API

```typescript
// src/lib/content/api/quests.ts

import fs from 'fs/promises';
import path from 'path';
import { QuestSchema, Quest } from '../schemas/quest';

const QUESTS_DIR = path.join(process.cwd(), 'content/quests');

export async function getAllQuests(): Promise<Quest[]> {
  const files = await fs.readdir(QUESTS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const quests = await Promise.all(
    jsonFiles.map(async (filename) => {
      const filePath = path.join(QUESTS_DIR, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return QuestSchema.parse(data);
    })
  );

  return quests;
}

export async function getQuestById(id: string): Promise<Quest | null> {
  const filePath = path.join(QUESTS_DIR, `${id}.json`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return QuestSchema.parse(data);
  } catch {
    return null;
  }
}

export async function getQuestForPost(postSlug: string): Promise<Quest | null> {
  const allQuests = await getAllQuests();
  return allQuests.find((q) => q.hostPostSlug === postSlug) || null;
}
```

```typescript
// src/lib/content/api/items.ts

import fs from 'fs/promises';
import path from 'path';
import { ItemSchema, Item } from '../schemas/item';

const ITEMS_DIR = path.join(process.cwd(), 'content/items');

export async function getAllItems(): Promise<Item[]> {
  const files = await fs.readdir(ITEMS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const items = await Promise.all(
    jsonFiles.map(async (filename) => {
      const filePath = path.join(ITEMS_DIR, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return ItemSchema.parse(data);
    })
  );

  return items;
}

export async function getItemById(id: string): Promise<Item | null> {
  const filePath = path.join(ITEMS_DIR, `${id}.json`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return ItemSchema.parse(data);
  } catch {
    return null;
  }
}
```

### 4.4. Desktop Icons & Windows API

```typescript
// src/lib/content/api/desktop.ts

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {
  DesktopIconsFileSchema,
  DesktopIconsFile,
  DesktopIcon,
} from '../schemas/desktop-icon';
import {
  WindowContentFrontmatterSchema,
  WindowContent,
} from '../schemas/window';

const DESKTOP_DIR = path.join(process.cwd(), 'content/desktop');
const WINDOWS_DIR = path.join(DESKTOP_DIR, 'windows');

/**
 * Get all desktop icons configuration
 */
export async function getDesktopIcons(): Promise<DesktopIconsFile> {
  const filePath = path.join(DESKTOP_DIR, 'icons.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  return DesktopIconsFileSchema.parse(data);
}

/**
 * Get visible desktop icons for a user based on their level and items
 */
export async function getVisibleDesktopIcons(
  userLevel: number,
  userItems: string[]
): Promise<DesktopIcon[]> {
  const { icons } = await getDesktopIcons();

  return icons
    .filter((icon) => {
      // Check visibility flag
      if (!icon.visible) return false;

      // Check level requirement
      if (icon.requiredLevel && userLevel < icon.requiredLevel) return false;

      // Check item requirement
      if (icon.requiredItem && !userItems.includes(icon.requiredItem))
        return false;

      return true;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Get a single desktop icon by ID
 */
export async function getDesktopIconById(
  id: string
): Promise<DesktopIcon | null> {
  const { icons } = await getDesktopIcons();
  return icons.find((icon) => icon.id === id) || null;
}

/**
 * Get custom window content by ID (for 'custom' windowType icons)
 */
export async function getWindowContent(
  windowId: string
): Promise<WindowContent | null> {
  const filePath = path.join(WINDOWS_DIR, `${windowId}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = WindowContentFrontmatterSchema.parse(data);

    return {
      ...frontmatter,
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Get all custom window contents
 */
export async function getAllWindowContents(): Promise<WindowContent[]> {
  try {
    const files = await fs.readdir(WINDOWS_DIR);
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

    const windows = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filePath = path.join(WINDOWS_DIR, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const frontmatter = WindowContentFrontmatterSchema.parse(data);

        return {
          ...frontmatter,
          content,
        };
      })
    );

    return windows;
  } catch {
    return [];
  }
}
```

---

## 5. MDX Rendering

### 5.1. Dependencies

```bash
pnpm add next-mdx-remote gray-matter reading-time zod
```

### 5.2. MDX Configuration

```typescript
// src/lib/content/utils/mdx.ts

import { compileMDX } from 'next-mdx-remote/rsc';
import { QuestCard } from '@/components/QuestCard';
import { CodeBlock } from '@/components/CodeBlock';
import { Callout } from '@/components/Callout';
import { ItemGate } from '@/components/ItemGate';

// Custom components available in MDX files
const mdxComponents = {
  // Quest component embedded in posts
  QuestCard,

  // Custom code block with syntax highlighting
  code: CodeBlock,
  pre: (props: React.ComponentProps<'pre'>) => <pre {...props} />,

  // Callout boxes (info, warning, tip)
  Callout,

  // Item-gated content sections within a post
  ItemGate,

  // Styled elements
  h1: (props: React.ComponentProps<'h1'>) => (
    <h1 className="diegohq-heading diegohq-heading--1" {...props} />
  ),
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2 className="diegohq-heading diegohq-heading--2" {...props} />
  ),
  // ... etc
};

export async function renderMDX(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return { content, frontmatter };
}
```

### 5.3. Example Post MDX

````mdx
---
title: 'Intro to Git: Your First Commit'
slug: intro-to-git
excerpt: 'Learn the fundamentals of version control with Git.'
date: 2025-12-30T10:00:00Z
contentPillar: programming
targetLevel: beginner
tags:
  - git
  - version-control
  - tutorial
readXp: 15
questId: the-first-chronicler
published: true
featured: true
---

# Welcome, Adventurer!

Today we embark on a journey into the realm of **Version Control**. Git is your trusty companion for tracking changes in your code.

<Callout type="info">
  Git was created by Linus Torvalds in 2005 for Linux kernel development.
</Callout>

## Your First Commands

```bash
git init
git add .
git commit -m "My first commit"
```
````

## The Quest Awaits

Now that you've learned the basics, prove your knowledge!

<QuestCard questId="the-first-chronicler" />
```

### 5.4. Example Desktop Icons Configuration

```json
// content/desktop/icons.json
{
  "icons": [
    {
      "id": "journal",
      "label": "Journal",
      "icon": "/desktop-icons/book.png",
      "position": { "x": 0, "y": 0 },
      "windowType": "journal",
      "windowConfig": {
        "title": "The Adventurer's Journal",
        "defaultWidth": 800,
        "defaultHeight": 600
      },
      "order": 1
    },
    {
      "id": "quest-log",
      "label": "Quest Log",
      "icon": "/desktop-icons/scroll.png",
      "position": { "x": 0, "y": 1 },
      "windowType": "quest-log",
      "windowConfig": {
        "title": "Quest Log",
        "defaultWidth": 600,
        "defaultHeight": 500
      },
      "order": 2
    },
    {
      "id": "inventory",
      "label": "Inventory",
      "icon": "/desktop-icons/chest.png",
      "position": { "x": 0, "y": 2 },
      "windowType": "inventory",
      "requiredLevel": 2,
      "windowConfig": {
        "title": "Adventurer's Inventory",
        "defaultWidth": 500,
        "defaultHeight": 400
      },
      "order": 3
    },
    {
      "id": "about",
      "label": "About",
      "icon": "/desktop-icons/info.png",
      "position": { "x": 1, "y": 0 },
      "windowType": "custom",
      "windowId": "about",
      "order": 10
    },
    {
      "id": "secret-vault",
      "label": "Secret Vault",
      "icon": "/desktop-icons/vault.png",
      "position": { "x": 1, "y": 1 },
      "windowType": "custom",
      "windowId": "secret-vault",
      "requiredItem": "vault-key",
      "visible": true,
      "order": 99
    },
    {
      "id": "github",
      "label": "GitHub",
      "icon": "/desktop-icons/github.png",
      "position": { "x": 2, "y": 0 },
      "windowType": "external",
      "externalUrl": "https://github.com/diegohq",
      "order": 20
    }
  ],
  "settings": {
    "gridSize": 80,
    "iconSpacing": 16,
    "startPosition": { "x": 20, "y": 60 }
  }
}
```

### 5.5. Example Custom Window MDX

```mdx
## // content/desktop/windows/about.mdx

id: about
title: About This Journal
defaultWidth: 500
defaultHeight: 400
singleton: true
closable: true
minimizable: true
maximizable: false

---

# About The Adventurer's Journal

Welcome, traveler! You've stumbled upon a unique corner of the internet.

## What is this place?

This is a **gamified programming blog** where learning feels like an adventure.
Read journal entries, complete quests, earn XP, and level up!

## The Author

**Diego** is a software developer who believes learning should be fun.
This project combines his love for:

- 🎮 Retro gaming aesthetics
- 💻 Web development
- 📚 Teaching & sharing knowledge

## Tech Stack

Built with Next.js, TypeScript, and a lot of pixel art love.

<Callout type="tip">
  Double-click the Journal icon to start your adventure!
</Callout>
```

---

## 6. Admin Interface

The Admin interface is a protected route that renders within the OS as a special "Admin" window. It allows content creation and editing without leaving the gamified environment.

### 6.1. Route Structure

```
src/app/
├── admin/
│   ├── layout.tsx        # Admin layout (auth protection)
│   ├── page.tsx          # Admin dashboard
│   ├── desktop/          # Desktop icons management
│   │   ├── page.tsx      # Icon list & positions
│   │   ├── icons/
│   │   │   ├── new/
│   │   │   │   └── page.tsx  # Add new icon
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # Edit icon
│   │   └── windows/
│   │       ├── page.tsx      # Custom windows list
│   │       ├── new/
│   │       │   └── page.tsx  # Create window content
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx  # Edit window content
│   ├── posts/
│   │   ├── page.tsx      # Post list
│   │   ├── new/
│   │   │   └── page.tsx  # Create post form
│   │   └── [slug]/
│   │       └── edit/
│   │           └── page.tsx  # Edit post form
│   ├── quests/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   └── items/
│       ├── page.tsx
│       ├── new/
│       │   └── page.tsx
│       └── [id]/
│           └── edit/
│               └── page.tsx
```

### 6.2. Admin Layout (Auth Protection)

```typescript
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession();

  // Only allow admin users
  if (!session || session.user.role !== 'admin') {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="diegohq-admin">
      <nav className="diegohq-admin__nav">
        <a href="/admin">Dashboard</a>
        <a href="/admin/desktop">Desktop</a>
        <a href="/admin/posts">Posts</a>
        <a href="/admin/quests">Quests</a>
        <a href="/admin/items">Items</a>
      </nav>
      <main className="diegohq-admin__content">
        {children}
      </main>
    </div>
  );
}
```

### 6.3. Server Actions for Content CRUD

```typescript
// src/lib/content/actions/posts.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { PostFrontmatterSchema, PostFrontmatter } from '../schemas/post';
import { revalidatePath } from 'next/cache';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export async function createPost(
  frontmatter: PostFrontmatter,
  content: string
) {
  // Validate frontmatter
  const validated = PostFrontmatterSchema.parse(frontmatter);

  // Generate MDX file content
  const fileContent = matter.stringify(content, validated);

  // Write to file
  const filePath = path.join(POSTS_DIR, `${validated.slug}.mdx`);
  await fs.writeFile(filePath, fileContent, 'utf-8');

  // Revalidate cache
  revalidatePath('/journal');
  revalidatePath(`/journal/${validated.slug}`);

  return { success: true, slug: validated.slug };
}

export async function updatePost(
  slug: string,
  frontmatter: Partial<PostFrontmatter>,
  content?: string
) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  // Read existing file
  const existingContent = await fs.readFile(filePath, 'utf-8');
  const { data: existingData, content: existingBody } = matter(existingContent);

  // Merge frontmatter
  const newData = { ...existingData, ...frontmatter };
  const validated = PostFrontmatterSchema.parse(newData);

  // Generate new file content
  const newBody = content ?? existingBody;
  const fileContent = matter.stringify(newBody, validated);

  // Handle slug change (rename file)
  if (frontmatter.slug && frontmatter.slug !== slug) {
    const newFilePath = path.join(POSTS_DIR, `${frontmatter.slug}.mdx`);
    await fs.writeFile(newFilePath, fileContent, 'utf-8');
    await fs.unlink(filePath);
  } else {
    await fs.writeFile(filePath, fileContent, 'utf-8');
  }

  // Revalidate cache
  revalidatePath('/journal');
  revalidatePath(`/journal/${slug}`);
  if (frontmatter.slug) {
    revalidatePath(`/journal/${frontmatter.slug}`);
  }

  return { success: true };
}

export async function deletePost(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  await fs.unlink(filePath);

  revalidatePath('/journal');

  return { success: true };
}
```

### 6.4. Admin UI Components

Key admin components to build:

| Component           | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `DesktopIconEditor` | Visual editor for icon positions (drag & drop grid)        |
| `DesktopIconForm`   | Form for icon properties (label, window type, gating)      |
| `WindowEditor`      | Form for custom window content with MDX preview            |
| `PostEditor`        | Form for creating/editing posts with MDX preview           |
| `QuestEditor`       | Form for quest configuration                               |
| `ItemEditor`        | Form for item configuration                                |
| `ContentList`       | Reusable list view with search/filter                      |
| `MDXPreview`        | Live preview of MDX content                                |
| `FrontmatterForm`   | Dynamic form generated from Zod schema                     |
| `IconPicker`        | Visual picker for selecting icon images                    |
| `WindowTypePicker`  | Dropdown for selecting window type (journal, custom, etc.) |

---

## 7. Content Workflow

### 7.1. Managing Desktop Icons

1. Navigate to `/admin/desktop`
2. View current icon layout in visual grid
3. Drag icons to reposition them
4. Click "Add Icon" to create a new desktop icon
5. Configure: label, icon image, window type, position, gating requirements
6. For `custom` window type, create or select window content
7. Save updates `content/desktop/icons.json`

### 7.2. Creating Custom Window Content

1. Navigate to `/admin/desktop/windows/new`
2. Enter window ID, title, and default dimensions
3. Write MDX content for the window body
4. Configure behavior (singleton, closable, etc.)
5. Save creates `content/desktop/windows/{id}.mdx`
6. Link to a desktop icon by setting `windowType: 'custom'` and `windowId`

### 7.3. Creating a New Post

1. Navigate to `/admin/posts/new`
2. Fill in frontmatter fields (title, slug, pillar, etc.)
3. Write MDX content in the editor
4. Click "Save Draft" (sets `published: false`) or "Publish"
5. Server Action writes `.mdx` file to `content/posts/`
6. Cache is revalidated, post appears in Journal

### 7.4. Creating a Quest for a Post

1. Navigate to `/admin/quests/new`
2. Select the host post from dropdown
3. Configure quest type, prompt, options, rewards
4. Save quest as JSON to `content/quests/`
5. Update the post's `questId` field to link them

### 7.5. Content Validation

- **Build Time:** All content is validated during `pnpm build`
- **CI/CD:** Add a validation script to CI that fails on invalid content
- **Editor:** Real-time validation in Admin forms using Zod

```typescript
// scripts/validate-content.ts
import { getAllPosts } from '@/lib/content/api/posts';
import { getAllQuests } from '@/lib/content/api/quests';
import { getAllItems } from '@/lib/content/api/items';
import {
  getDesktopIcons,
  getAllWindowContents,
} from '@/lib/content/api/desktop';

async function validateContent() {
  console.log('Validating content...');

  try {
    // Validate desktop configuration
    const { icons } = await getDesktopIcons();
    console.log(`✓ ${icons.length} desktop icons validated`);

    const windowContents = await getAllWindowContents();
    console.log(`✓ ${windowContents.length} custom windows validated`);

    const posts = await getAllPosts();
    console.log(`✓ ${posts.length} posts validated`);

    const quests = await getAllQuests();
    console.log(`✓ ${quests.length} quests validated`);

    const items = await getAllItems();
    console.log(`✓ ${items.length} items validated`);

    // Cross-reference validation
    for (const icon of icons) {
      // Check custom window references
      if (icon.windowType === 'custom' && icon.windowId) {
        const window = windowContents.find((w) => w.id === icon.windowId);
        if (!window) {
          throw new Error(
            `Desktop icon "${icon.id}" references non-existent window "${icon.windowId}"`
          );
        }
      }
      // Check item requirements
      if (icon.requiredItem) {
        const item = items.find((i) => i.id === icon.requiredItem);
        if (!item) {
          throw new Error(
            `Desktop icon "${icon.id}" requires non-existent item "${icon.requiredItem}"`
          );
        }
      }
    }

    for (const post of posts) {
      if (post.questId) {
        const quest = quests.find((q) => q.id === post.questId);
        if (!quest) {
          throw new Error(
            `Post "${post.slug}" references non-existent quest "${post.questId}"`
          );
        }
      }
      if (post.requiredItem) {
        const item = items.find((i) => i.id === post.requiredItem);
        if (!item) {
          throw new Error(
            `Post "${post.slug}" requires non-existent item "${post.requiredItem}"`
          );
        }
      }
    }

    console.log('✓ All cross-references valid');
    console.log('Content validation passed!');
  } catch (error) {
    console.error('Content validation failed:', error);
    process.exit(1);
  }
}

validateContent();
```

---

## 8. Integration with Gamification

### 8.1. Checking Access in Journal Component

```typescript
// src/components/Journal/JournalPostCard.tsx

interface JournalPostCardProps {
  post: Post;
  userLevel: number;
  userItems: string[];
}

export const JournalPostCard = ({
  post,
  userLevel,
  userItems
}: JournalPostCardProps) => {
  const isLevelLocked = post.requiredLevel && userLevel < post.requiredLevel;
  const isItemLocked = post.requiredItem && !userItems.includes(post.requiredItem);
  const isLocked = isLevelLocked || isItemLocked;

  if (isLocked) {
    return (
      <article className="diegohq-post-card diegohq-post-card--locked">
        <h3>{post.title}</h3>
        {isLevelLocked && (
          <p className="diegohq-post-card__lock-reason">
            🔒 Requires Level {post.requiredLevel}
          </p>
        )}
        {isItemLocked && (
          <p className="diegohq-post-card__lock-reason">
            🔒 {post.challengeText || `Requires: ${post.requiredItem}`}
          </p>
        )}
      </article>
    );
  }

  return (
    <article className="diegohq-post-card">
      <a href={`/journal/${post.slug}`}>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span>+{post.readXp} XP</span>
      </a>
    </article>
  );
};
```

### 8.2. Tracking Post Reads

When a user finishes reading a post, call the backend API to award XP:

```typescript
// src/hooks/usePostRead.ts

export function usePostRead(postSlug: string, readXp: number) {
  const [hasRead, setHasRead] = useState(false);

  const markAsRead = async () => {
    if (hasRead) return;

    // Call backend API to award XP
    await fetch('/api/v1/game/read-post', {
      method: 'POST',
      body: JSON.stringify({ postSlug, xp: readXp }),
    });

    setHasRead(true);
  };

  // Trigger when user scrolls to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markAsRead();
        }
      },
      { threshold: 1.0 }
    );

    const endMarker = document.getElementById('post-end');
    if (endMarker) {
      observer.observe(endMarker);
    }

    return () => observer.disconnect();
  }, []);

  return { hasRead };
}
```

---

## 9. Development vs Production

### Development Mode

- Admin interface is fully accessible
- Content changes write directly to filesystem
- No authentication required (optional)
- Hot reload on content changes

### Production Mode

- Admin interface requires authentication
- Content is read-only (pre-built during deployment)
- Changes require a new deployment (Git-based workflow)
- Optionally: Enable write operations for authorized admins

```typescript
// src/lib/content/config.ts

export const contentConfig = {
  // In production, content is read-only by default
  readonly: process.env.NODE_ENV === 'production',

  // Allow admin writes in production (requires auth)
  allowProductionWrites: process.env.ALLOW_CONTENT_WRITES === 'true',

  // Paths
  postsDir: 'content/posts',
  questsDir: 'content/quests',
  itemsDir: 'content/items',
};
```

---

## 10. Migration Path

If there's existing content to migrate:

1. **From Markdown:** Run a script to add required frontmatter fields
2. **From External CMS:** Export as JSON/Markdown, transform to our schema
3. **Validation:** Run `pnpm validate-content` to ensure all content is valid

---

## 11. Future Enhancements

### Phase 2+

- **Draft/Preview URLs:** Generate preview URLs for unpublished content
- **Scheduled Publishing:** Add `publishedAt` field, show posts only after that date
- **Content Versioning:** Track content changes with Git history viewer in Admin
- **Media Library:** Manage images/assets in a dedicated Admin section
- **Content Search:** Full-text search across all content
- **Content Analytics:** Track post views, engagement, quest completion rates

---

## Summary

The custom CMS provides:

1. **Git-based content** — Version controlled, code-reviewable
2. **Type-safe schemas** — Zod validation catches errors early
3. **Gamification-native** — Built-in support for XP, gating, quests, items
4. **In-OS Admin** — Maintains the retro aesthetic
5. **No external dependencies** — Full control, no API limits or costs
6. **Developer-friendly** — MDX, TypeScript, Server Actions

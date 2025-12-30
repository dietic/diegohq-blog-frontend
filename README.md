# The Adventurer's Journal

A gamified programming blog styled as a retro Game Boy Advance (GBA) operating system. Users navigate a pixel-art desktop, open windows to read journal entries (blog posts), complete quests, earn XP, level up, and collect items to unlock gated content.

## 🎮 Project Overview

This is the frontend for "The Adventurer's Journal" — a unique blogging platform that transforms learning into an adventure. Built with Next.js 16+ and styled to look like a retro operating system.

**Current Phase:** Phase 1 (MVP) - Core Journal & OS

## 🛠️ Tech Stack

| Technology             | Purpose                               |
| ---------------------- | ------------------------------------- |
| **Next.js 16+**        | App Router, Server Components         |
| **TypeScript**         | Strict mode enabled                   |
| **React 19+**          | Functional components only            |
| **Custom CMS**         | Git-based MDX files with Zod schemas  |
| **react-rnd**          | Draggable/resizable window management |
| **next-mdx-remote**    | MDX rendering with custom components  |
| **Plain SCSS**         | Styling (no Tailwind, no CSS Modules) |
| **Vitest + Storybook** | Testing and component isolation       |

## 📁 Project Structure

```
diegohq-blog-frontend/
├── planning/              # Planning documents (READ FIRST)
│   ├── CUSTOM_CMS.md      # CMS architecture (important!)
│   ├── TECHNICAL_STANDARDS.md
│   └── ...
├── content/               # CMS content (Git-tracked)
│   ├── posts/             # MDX journal entries
│   ├── quests/            # Quest definitions (JSON)
│   └── items/             # Item definitions (JSON)
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/
│   │   └── content/       # CMS API (schemas, fetching, actions)
│   └── styles/            # SCSS variables, mixins
└── public/                # Static assets
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run Storybook
pnpm storybook

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Documentation

Before contributing, read these planning documents:

1. **[CUSTOM_CMS.md](planning/CUSTOM_CMS.md)** — CMS architecture, schemas, and content API
2. **[TECHNICAL_STANDARDS.md](planning/TECHNICAL_STANDARDS.md)** — Coding guidelines (MUST FOLLOW)
3. **[todo.md](planning/todo.md)** — Current task list and priorities

## 🎯 Key Features

- **Retro OS Interface:** Pixel-art desktop with draggable windows
- **Custom CMS:** Git-based MDX content with Zod validation
- **Gamification:** XP system, levels, quests, and collectible items
- **Content Gating:** Level-locked and item-locked journal entries
- **Admin Interface:** In-OS content management at `/admin`

## 🔧 Custom CMS

The project uses a custom Content Management System built specifically for gamification:

- **Content Storage:** MDX files in `content/` directory (Git-tracked)
- **Validation:** Zod schemas for type-safe frontmatter
- **API:** Server-side content fetching with `next-mdx-remote`
- **Admin:** Protected route at `/admin` with Server Actions for CRUD

See [CUSTOM_CMS.md](planning/CUSTOM_CMS.md) for full architecture details.

## 📝 License

Private project - All rights reserved.

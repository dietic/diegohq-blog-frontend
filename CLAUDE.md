# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DiegoHQ Blog Frontend - A gamified programming blog styled as a retro GBA operating system. Features a pixel-art desktop with draggable/resizable windows, XP system, quests, and collectible items.

## Commands

```bash
pnpm dev              # Development server on :3000
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm storybook        # Component stories on :6006
```

## Architecture

**Stack:** Next.js 16 (App Router) + TypeScript (strict) + React 19 + Plain SCSS + Zod

**Backend:** FastAPI at `http://localhost:8000/api/v1` (separate repo)

### Key Directories

- `src/app/` - Next.js pages (admin interface at `/admin`)
- `src/components/` - UI components (Desktop, Window, DesktopIcon, etc.)
- `src/lib/api/` - Backend API client and services
- `src/lib/content/` - Git-based CMS (schemas, actions, utils)
- `content/` - MDX posts, JSON quests/items, desktop config

### Window System

Uses `react-rnd` for draggable/resizable windows. Window state managed by `WindowContext` provider. Desktop icons trigger window opening based on `window_type` (journal, inventory, quest-log, custom, external).

### API Layer

- `src/lib/api/services/public.ts` - Public content fetching (no auth)
- `src/lib/api/services/*.ts` - Admin CRUD operations (auth required)
- Server Actions in `src/lib/content/actions/` for CMS operations

## Code Conventions

**Components:**
- Arrow functions with named exports (no `export default`)
- Props interface: `[ComponentName]Props`
- Server Components by default; `'use client'` only when needed
- Co-locate: `Component.tsx`, `Component.scss`, `Component.stories.tsx`

**Styling:**
- Plain SCSS (not modules), BEM naming: `diegohq-component__element--modifier`
- Pixel art: add `image-rendering: pixelated;`
- Reference variables from `src/styles/_variables.scss`

**TypeScript:**
- No `any` - use `unknown` or generics
- Prefer `interface` over `type` for public APIs

**Import Order:**
1. React/Next.js
2. Third-party
3. Internal components
4. Hooks/Utils
5. Styles (last)

## Planning Documents

Read these in `planning/` for detailed specifications:
- `AGENT_INSTRUCTIONS.md` - AI agent guidelines
- `TECHNICAL_STANDARDS.md` - Coding standards
- `CUSTOM_CMS.md` - CMS architecture
- `GAMIFICATION_MECHANICS.md` - XP/quest system

# AI Agent Instructions: DiegoHQ Blog Frontend

This document provides comprehensive instructions for AI coding agents (GitHub Copilot, Claude, etc.) working on "The Adventurer's Journal" project. Read this document in full before making any changes.

---

## 🎯 Project Summary

**What is this project?**
A gamified programming blog styled as a retro Game Boy Advance (GBA) operating system. Users navigate a pixel-art desktop, open windows to read journal entries (blog posts), complete quests, earn XP, level up, and collect items to unlock gated content.

**Current Phase:** Phase 1 (MVP) - Core Journal & OS

**Tech Stack:**

- **Frontend:** Next.js 16+ (App Router)
- **CMS:** Payload CMS (Next.js Native)
- **Game Backend:** Python FastAPI (External API - not in this repo)
- **Language:** TypeScript (Strict Mode)
- **React:** 19+ (Functional Components only)
- **Window Management:** `react-rnd`
- **Styling:** Plain SCSS (Global Scope, BEM Naming)
- **Testing:** Vitest + Storybook
- **Package Manager:** `pnpm`

---

## 📁 Project Structure

```
diegohq-blog-frontend/
├── planning/                    # 📖 READ THESE FIRST
│   ├── PROJECT_OVERVIEW.md      # Vision and core concept
│   ├── FEATURES.md              # Full feature list
│   ├── TECHNICAL_STANDARDS.md   # Coding guidelines (MUST FOLLOW)
│   ├── THEMING_AND_AESTHETICS.md # Visual & audio design rules
│   ├── GAMIFICATION_MECHANICS.md # XP, levels, quests, items
│   ├── CONTENT_STRATEGY.md      # How posts integrate with gameplay
│   ├── MVP_ROLLOUT_PLAN.md      # Phased development approach
│   ├── MIGRATION_GUIDE.md       # Tailwind → Plain SCSS migration details
│   ├── todo.md                  # Current task list
│   └── AGENT_INSTRUCTIONS.md    # THIS FILE
├── src/
│   ├── app/
│   │   ├── fonts.ts             # next/font definitions
│   │   ├── globals.css          # Global styles (being migrated)
│   │   ├── theme.css            # CSS variables (TO BE CREATED)
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page (Desktop)
│   ├── components/              # (TARGET - move components here)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities, API clients
│   ├── styles/                  # Shared SCSS (variables, mixins)
│   └── stories/components/      # CURRENT component location (Storybook)
│       ├── Button/
│       ├── Desktop/
│       ├── DesktopIcon/
│       ├── Navbar/
│       └── Window/
├── public/
│   ├── desktop-icons/           # Pixel art icons
│   ├── background.svg           # Desktop background
│   └── logo-journal.png         # Navbar logo
└── package.json
```

---

## ⚠️ CRITICAL RULES (Always Follow)

### 1. Code Style

- **Arrow Functions** for all components
- **Named Exports** only (no `export default`)
- **Props Interface** named `[ComponentName]Props`
- **No `any` type** - use `unknown` or generics
- **Prefer `interface`** over `type` for public APIs

```tsx
// ✅ CORRECT
interface WindowProps {
  title: string;
  isOpen: boolean;
}

export const Window = ({ title, isOpen }: WindowProps) => {
  return <div>{title}</div>;
};

// ❌ WRONG
export default function Window(props: any) { ... }
```

### 2. Server vs Client Components

- **Default:** Server Components
- **Use `'use client'` ONLY when needed:**
  - Event handlers (`onClick`, `onChange`)
  - React Hooks (`useState`, `useEffect`, etc.)
  - Browser APIs (`window`, `localStorage`, `document`)

### 3. Styling

- **Plain SCSS:** Use `.scss` files with BEM naming (e.g., `.diegohq-window__title`)
- **CSS Variables:** Reference from `theme.css` (e.g., `var(--window-primary-bg)`)
- **BEM-like naming:** `hq-component--element` or `hq-component__modifier`
- **Pixel Art CSS:** Add `image-rendering: pixelated;` to all icons/images

### 4. File Structure (Co-location)

Each component lives in its own folder:

```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.scss
├── ComponentName.stories.tsx
└── ComponentName.test.tsx
```

### 5. Imports Order

Always group imports in this order:

```tsx
// 1. React / Next.js
import { useState, useEffect } from 'react';
import Image from 'next/image';

// 2. Third-party libraries
import { Rnd } from 'react-rnd';

// 3. Internal components
import { Button } from '@/components/Button';

// 4. Hooks / Utils
import { useWindowContext } from '@/hooks/useWindowContext';

// 5. Styles (last)
import './ComponentName.scss';
```

### 6. Commit Messages

Use **Conventional Commits**:

```
feat(component): add new feature
fix(window): resolve drag issue
refactor(desktop): improve icon grid
chore(deps): update dependencies
docs: update README
```

---

## 🎨 Design System Reference

### Colors (CSS Variables)

```css
/* Buttons */
--button-primary: oklch(0.9021 0.134 165.84);
--button-primary-border: oklch(0.7066 0.1637 158.07);

/* Windows */
--window-primary-bg: oklch(0.9861 0.0017 325.59);
--window-primary-border: oklch(0.2768 0 0);
--window-primary-header: oklch(0.3739 0.0599 264.04);
--window-primary-header-foreground: oklch(0.9861 0.0017 325.59);
--window-primary-action-bg: oklch(0.5252 0.0599 264.04);

/* Icons */
--icon-primary-label-bg: oklch(0.3739 0.0599 264.04 / 80%);

/* Radius */
--radius-xs: 0.125rem;
--radius-md: 0.25rem;
--radius-lg: 0.5rem;
```

### Fonts

| Context               | Font           | Variable                |
| --------------------- | -------------- | ----------------------- |
| Body (default)        | Press Start 2P | `--font-press-start-2p` |
| Window titles, labels | VT323          | `--font-vt323`          |
| Code blocks           | Roboto Mono    | -                       |

### Spacing Scale (4px base)

| Token       | Value |
| ----------- | ----- |
| `--space-1` | 4px   |
| `--space-2` | 8px   |
| `--space-3` | 12px  |
| `--space-4` | 16px  |
| `--space-5` | 24px  |
| `--space-6` | 32px  |
| `--space-8` | 48px  |

### Z-Index Scale

| Layer         | Value |
| ------------- | ----- |
| Base          | 0     |
| Windows       | 200   |
| Active Window | 250   |
| Modals        | 300   |
| Taskbar       | 500   |
| Notifications | 600   |

---

## 🧩 Existing Components Reference

### Desktop (`src/stories/components/Desktop/`)

- **Purpose:** Main container, renders Navbar + icons + children windows
- **Props:** `icons: DesktopIconProps[]`, `children?: ReactNode`
- **Styling:** Uses `hq-desktop` class, background from `background.svg`

### DesktopIcon (`src/stories/components/DesktopIcon/`)

- **Purpose:** Draggable desktop icons using `react-rnd`
- **Props:** `label`, `icon`, `initialX`, `initialY`, `windowUrl?`
- **Functionality:** Drag-and-drop, label with background overlay

### Navbar (`src/stories/components/Navbar/`)

- **Purpose:** Taskbar at top of screen
- **Features:** Logo, title "Journal OS", formatted date, live clock (updates every second)
- **Note:** Currently uses Tailwind utilities that need migration

### Window (`src/stories/components/Window/`)

- **Purpose:** Draggable, resizable window using `react-rnd`
- **Props:** `windowTitle`, `showWindowActions?`, `children?`, `onClose?`, `onMinimize?`
- **Features:**
  - Drag via header (`dragHandleClassName="hq-window--header"`)
  - Resize via `react-rnd`
  - Minimize (collapses to header only, positions at bottom-left)
  - Maximize (full screen, restores on drag)
  - Close (removes from DOM)
- **Sub-components:** `WindowHeader`, `WindowButton`

### WindowHeader (`src/stories/components/Window/WindowHeader/`)

- **Purpose:** Title bar with action buttons
- **Props:** `windowTitle`, `showWindowActions?`, `onMinimize?`, `onMaximize?`, `onClose?`

### WindowButton (`src/stories/components/Window/WindowButton/`)

- **Purpose:** Circular action buttons (close, minimize, maximize)
- **Props:** `iconName`, `onClick?`
- **Uses:** `@nsmr/pixelart-react` for icons

### Button (`src/stories/components/Button/`)

- **Purpose:** Styled button component
- **Props:** `variant: 'primary' | 'outline'`, `size: 'xs' | 'md' | 'lg'`, `label`
- **Features:** Drop shadow, active state animation

### WindowContext (`src/stories/components/Window/WindowContext.tsx`)

- **Purpose:** Context for window size status
- **Provides:** `windowSizeStatus`, `setWindowSizeStatus`
- **States:** `NORMAL`, `MAXIMIZED`, `MINIMIZED`

---

## 📋 Current Tasks (Phase 1)

Reference `planning/todo.md` for the full list. Key priorities:

### 1. Project Cleanup & Migration

1. Create `src/app/theme.css` with all CSS variables
2. Create `src/styles/_variables.scss` (breakpoints, font stacks)
3. Create `src/styles/_mixins.scss` (responsive helpers, pixel-art)
4. Remove Tailwind dependencies
5. Replace Tailwind utility classes with SCSS (see `MIGRATION_GUIDE.md`)
6. Move components from `src/stories/components/` to `src/components/`
7. Convert styles to Plain `.scss` files

### 2. Component Enhancements

1. **Desktop:** Implement responsive background, content area styling
2. **DesktopIcon:** Add double-click handler, grid positioning, focus states
3. **Navbar:** Refactor for SCSS modules, add open windows list, Start button
4. **Window:** Ensure contained drag (can't go off-screen), window focus management

### 3. Window Management System

1. Enhance `WindowContext` with: `openWindows`, `activeWindowId`, `minimizedWindows`
2. Implement: `openWindow(id, component)`, `closeWindow(id)`, `focusWindow(id)`

### 4. CMS & Content

1. Install Payload CMS (`payload`, `graphql`, etc.)
2. Create `payload.config.ts`
3. Create Journal component to list and render posts

---

## 🔧 Common Operations

### Running the Project

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
pnpm storybook  # Start Storybook
pnpm test       # Run Vitest
```

### Creating a New Component

1. Create folder: `src/components/ComponentName/`
2. Create files:
   - `ComponentName.tsx` (component logic)
   - `ComponentName.scss` (styles)
   - `ComponentName.stories.tsx` (Storybook)
   - `ComponentName.test.tsx` (tests - optional for MVP)

Example template:

```tsx
// ComponentName.tsx
'use client'; // Only if needed

import './ComponentName.scss';

interface ComponentNameProps {
  // Define props
}

export const ComponentName = ({ ...props }: ComponentNameProps) => {
  return <div className={styles.componentName}>{/* Content */}</div>;
};
```

```scss
// ComponentName.scss
.diegohq-component-name {
  /* styles */
}
  // Styles using CSS variables
  background: var(--window-primary-bg);
  padding: var(--space-4);
}
```

### Working with react-rnd

The `Window` and `DesktopIcon` components use `react-rnd`. Key notes:

- Use `dragHandleClassName` to specify drag handle
- Use `enableResizing` to control resize behavior
- Position is controlled via `position` prop (x, y)
- Size is controlled via `size` prop (width, height)

### Working with CSS Modules

When using CSS Modules with external libraries (like react-rnd):

```tsx
// If react-rnd needs a specific class name for dragHandle:
<Rnd
  dragHandleClassName={styles.header} // This won't work - class is hashed
  // Use :global() in SCSS instead:
/>
```

```scss
// In your .scss file
:global(.hq-window--header) {
  cursor: move;
}

.header {
  composes: hq-window--header from global;
}
```

Or keep using regular SCSS (not modules) for components that need global class names.

---

## ⚡ Performance Guidelines

1. **Use Server Components** by default
2. **Lazy load** window content with `next/dynamic`
3. **Use `next/image`** for all images
4. **Bundle target:** < 200KB JS, < 50KB CSS
5. **Core Web Vitals:** LCP < 2.5s, CLS < 0.1

---

## 🔒 Security Guidelines

1. **Never use `dangerouslySetInnerHTML`** without sanitization
2. **Store JWT in HTTP-only cookies** (not localStorage)
3. **Validate all user inputs** on client and server
4. **Run `pnpm audit`** regularly

---

## 📱 Responsive Strategy

- **Desktop (≥1024px):** Full retro OS with draggable windows
- **Mobile (<1024px):** "Handheld Mode" - full-screen views, bottom tab bar
- Detect with `useMediaQuery` hook or CSS media queries

---

## 🎮 Gamification Context (For Future Phases)

While not implemented in Phase 1, understand the endgame:

- **XP:** Earned by reading posts (10 XP), completing quests (30-50 XP)
- **Levels:** XP curve formula: `(level ^ 1.5) * 100`
- **Items:** Virtual items earned from quests, used to unlock gated content
- **Level-Gating:** Posts locked until user reaches required level
- **Item-Gating:** Posts locked until user has required item

The Python FastAPI backend handles:

- User authentication
- XP/Level tracking
- Quest/Item management
- Content gating logic

---

## 📝 Before You Code

1. **Read relevant planning docs** for the feature you're implementing
2. **Check `todo.md`** to understand priorities
3. **Check `MIGRATION_GUIDE.md`** if touching existing components
4. **Follow TECHNICAL_STANDARDS.md** for code style
5. **Create Storybook story** for any new UI component
6. **Run `pnpm lint`** before committing

---

## 🚨 Common Pitfalls to Avoid

1. ❌ Using `export default` - use named exports
2. ❌ Using `any` type - define proper types
3. ❌ Mixing Tailwind and SCSS - we're migrating away from Tailwind
4. ❌ Adding `'use client'` unnecessarily - default to Server Components
5. ❌ Storing tokens in localStorage - use HTTP-only cookies
6. ❌ Hardcoding colors/spacing - use CSS variables
7. ❌ Forgetting to handle loading/error states
8. ❌ Large components > 200 lines - break them down

---

## 📚 Quick Reference Links

| Document                    | Purpose                      |
| --------------------------- | ---------------------------- |
| `PROJECT_OVERVIEW.md`       | Vision, mission, core loop   |
| `FEATURES.md`               | Complete feature list        |
| `TECHNICAL_STANDARDS.md`    | **MUST READ** - Coding rules |
| `THEMING_AND_AESTHETICS.md` | Visual design, colors, fonts |
| `GAMIFICATION_MECHANICS.md` | XP, levels, quests, items    |
| `MVP_ROLLOUT_PLAN.md`       | Development phases           |
| `MIGRATION_GUIDE.md`        | Tailwind → Plain SCSS migration    |
| `todo.md`                   | Current task list            |

---

## 🤖 Agent Workflow Recommendations

### When asked to implement a feature:

1. Read relevant planning docs
2. Check if related components exist
3. Plan the component structure
4. Implement following all standards
5. Create Storybook story
6. Update `todo.md` to mark completion

### When asked to fix a bug:

1. Understand the current behavior
2. Identify the root cause
3. Fix with minimal changes
4. Ensure no regressions
5. Commit with `fix(scope): description`

### When asked to refactor:

1. Commit current working state first
2. Read MIGRATION_GUIDE.md if relevant
3. Make changes incrementally
4. Test after each step
5. Commit with `refactor(scope): description`

---

## ✅ Definition of Done

A task is complete when:

- [ ] Code follows all TECHNICAL_STANDARDS.md rules
- [ ] Component has a `.stories.tsx` file (if UI)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Visual design matches THEMING_AND_AESTHETICS.md
- [ ] Responsive behavior works (if applicable)
- [ ] Committed with proper conventional commit message

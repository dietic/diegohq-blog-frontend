# Detailed To-Do List

## Phase 1: The Core Journal & OS (Minimum Viable Product)

### 1. Project Initialization & Cleanup

- [x] **Next.js Structure:** Verify and organize `src/` directory structure (components, hooks, lib, styles).
- [x] **Palette Preservation:**
  - [x] Create `src/app/theme.css`.
  - [x] Copy all custom colors from `tailwind.config.ts` (or current CSS) into CSS variables in `theme.css`.
  - [x] Ensure all existing components reference these variables.
- [x] **Tailwind Removal:**
  - [x] Uninstall `tailwindcss`, `postcss`, and related plugins. (tailwindcss removed from package.json)
  - [x] Remove `tailwind.config.ts` and `postcss.config.mjs`. (tailwind.config.ts doesn't exist; postcss.config.mjs deleted)
  - [x] Clean up `globals.css` to remove `@tailwind` directives and Tailwind-specific syntax.
- [x] **SCSS Setup:**
  - [x] **Strict Requirement:** Do NOT use SCSS Modules. Use plain `.scss` files.
  - [x] Create `src/styles/` directory structure:
    - `_variables.scss` (Colors, Fonts - extracted from Tailwind theme)
    - `_mixins.scss` (Breakpoints, Helpers)
    - `_reset.scss`
  - [x] **Keep globals.css:** Continue using `src/app/globals.css` and import theme variables into it.
  - [x] **Component Styles:** All component `.scss` files should use plain SCSS (not `.module.scss`).

### 2. Core UI Components (Refactoring)

- [x] **Desktop Layout:**
  - [x] Refactor `Desktop.tsx` to serve as the main screen container.
  - [x] Implement responsive background handling.
- [x] **Desktop Icons:**
  - [x] Add double-click handler to open associated windows.
  - [x] Style with pixel-perfect focus states.

### 3. Window Management System

- [x] **Planning:**
  - [x] Create detailed implementation plan for `WindowsManager`.
- [x] **Context & Hook:**
  - [x] Update `WindowContext.tsx` to be the "Source of Truth".
  - [x] Implement `useWindowManager` hook.
- [x] **Implementation:**
  - [x] State: `windows` array, `activeId`.
  - [x] Logic: `open`, `close`, `minimize`, `focus`.
  - [x] **Verification:** Verified manual flows (Open, Minimize, Restore).
- [x] **Window Component (The UI):**
  - [x] Refactor `Window.tsx` to wrap content in `<Rnd>` component.
        [x] Internalize `defaultPosition` and `defaultSize`.
  - [x] Bind `onMouseDown` to trigger `focusWindow` (bring to front).
  - [x] Implement Title Bar actions: Close, Minimize, Maximize.
  - [x] Ensure "contained" drag behavior (add `bounds="parent"`).

### 4. Custom CMS & Content

> See `planning/CUSTOM_CMS.md` for full architecture details.

- [ ] **Content Directory Setup:**
  - [ ] Create `content/desktop/` directory for desktop configuration.
  - [ ] Create `content/desktop/icons.json` with initial desktop icons.
  - [ ] Create `content/desktop/windows/` for custom window MDX content.
  - [ ] Create `content/posts/` directory for MDX journal entries.
  - [ ] Create `content/quests/` directory for quest JSON files.
  - [ ] Create `content/items/` directory for item JSON files.
  - [ ] Add sample content files for testing.

- [ ] **Content Schemas (Zod + TypeScript):**
  - [ ] Create `src/lib/content/schemas/desktop-icon.ts` with `DesktopIconSchema`.
  - [ ] Create `src/lib/content/schemas/window.ts` with `WindowContentFrontmatterSchema`.
  - [ ] Create `src/lib/content/schemas/post.ts` with `PostFrontmatterSchema`.
  - [ ] Create `src/lib/content/schemas/quest.ts` with `QuestSchema`.
  - [ ] Create `src/lib/content/schemas/item.ts` with `ItemSchema`.

- [ ] **Content API:**
  - [ ] Install dependencies: `pnpm add next-mdx-remote gray-matter reading-time zod`.
  - [ ] Create `src/lib/content/api/desktop.ts` (getDesktopIcons, getVisibleDesktopIcons, getWindowContent).
  - [ ] Create `src/lib/content/api/posts.ts` (getAllPosts, getPostBySlug, getAccessiblePosts).
  - [ ] Create `src/lib/content/api/quests.ts` (getAllQuests, getQuestById, getQuestForPost).
  - [ ] Create `src/lib/content/api/items.ts` (getAllItems, getItemById).
  - [ ] Create `src/lib/content/utils/mdx.ts` for MDX rendering with custom components.
  - [ ] Create `src/lib/content/utils/reading-time.ts` for calculating read time.
  - [ ] Create `src/lib/content/index.ts` with public exports.

- [ ] **MDX Components:**
  - [ ] Create `QuestCard` component (embeddable in posts).
  - [ ] Create `Callout` component (info, warning, tip boxes).
  - [ ] Create `CodeBlock` component (syntax highlighting).
  - [ ] Create `ItemGate` component (inline gated content).

- [ ] **Admin Interface:**
  - [ ] Create `src/app/admin/layout.tsx` with auth protection.
  - [ ] Create `src/app/admin/page.tsx` (dashboard).
  - [ ] Create `src/app/admin/desktop/` routes (icon list, visual grid editor).
  - [ ] Create `src/app/admin/desktop/icons/` routes (new, edit).
  - [ ] Create `src/app/admin/desktop/windows/` routes (list, new, edit custom window content).
  - [ ] Create `src/app/admin/posts/` routes (list, new, edit).
  - [ ] Create `src/app/admin/quests/` routes (list, new, edit).
  - [ ] Create `src/app/admin/items/` routes (list, new, edit).
  - [ ] Create Server Actions for content CRUD in `src/lib/content/actions/`.

- [ ] **Desktop Component Integration:**
  - [ ] Refactor `Desktop.tsx` to load icons from CMS (`getDesktopIcons`).
  - [ ] Implement `getVisibleDesktopIcons` filtering based on user level/items.
  - [ ] Update `DesktopIcon` to use CMS-defined window configurations.
  - [ ] Create window renderer that handles different `windowType` values.
  - [ ] Implement custom window content rendering with MDX.

- [ ] **Content Validation:**
  - [ ] Create `scripts/validate-content.ts` for CI validation.
  - [ ] Add `pnpm validate-content` script to `package.json`.

- [ ] **Journal Integration:**
  - [ ] Create `src/components/Journal/Journal.tsx` window component.
  - [ ] Create `src/components/Journal/JournalPostCard.tsx` with gating logic.
  - [ ] Create `src/components/Journal/JournalPostDetail.tsx` for reading posts.
  - [ ] Integrate with FastAPI backend for XP tracking.

### 5. Backend Integration

- [ ] **API Client:**
  - [ ] Create `src/lib/api.ts`.
  - [ ] Define Types/Interfaces for Game Metadata responses.
  - [ ] Implement `fetchGameMetadata()` to call Backend API.
- [ ] **Journal Window:**
  - [ ] Create `Journal.tsx` (to be rendered inside a Window).
  - [ ] Fetch post list from Backend/CMS.
  - [ ] Implement "Read Post" view (Markdown rendering).

---

## Phase 1.5: UX, Mobile & Onboarding

### 1. Mobile "Handheld" Mode

- [ ] **Responsive Logic:** Implement `useMediaQuery` or CSS media queries to detect mobile.
- [ ] **Mobile Layout:**
  - [ ] Create `MobileDesktop` component (alternative to `Desktop`).
  - [ ] Replace draggable windows with full-screen views.
  - [ ] Implement a bottom tab bar or "App Drawer" for navigation.

### 2. Onboarding Experience

- [ ] **BIOS Sequence:**
  - [ ] Create a `BootSequence` component (black screen, scrolling text, "Memory OK").
  - [ ] Show this only on first visit (use `localStorage` flag).
- [ ] **Helper Sprite:**
  - [ ] Create `Helper.tsx` (floating sprite).
  - [ ] Implement basic dialog bubbles ("Click the Journal to start!").

### 3. Accessibility & Polish

- [ ] **Reader Mode:** Create a context/toggle to switch body font to a legible Sans-Serif.
- [ ] **Keyboard Nav:** Ensure `Tab` cycles through Desktop Icons and Window controls.
- [ ] **Spotlight Search:**
  - [ ] Implement `CommandPalette` component (using `cmdk` or custom).
  - [ ] Index posts and apps for quick search.

---

## Phase 2: Introducing Progression

### 1. Authentication

- [ ] **Auth Client:** Implement `login`, `register`, `logout` functions calling Backend API.
- [ ] **Session Management:** Store JWT securely (HTTP-only cookie or memory).
- [ ] **Login Window:** Create a specific window for user entry.

### 2. User State & XP

- [ ] **User Hook:** Create `useUser` hook (SWR or React Query recommended) to poll/fetch `me` endpoint.
- [ ] **Leveling Logic:**
  - [ ] Handle "Level Up" events (compare previous level vs current level).
  - [ ] Trigger visual celebration (confetti, sound) on level increase.
- [ ] **Read Tracking:**
  - [ ] Create `ReadPost` component/hook that fires API call when user scrolls to bottom of a post.

### 3. Profile Window

- [ ] **UI Design:** Create a "Character Sheet" style window.
- [ ] **Stats Display:** Render Level, current XP, and XP to next level (progress bar).

---

## Phase 3: The Full Gameplay Loop

### 1. Quest System

- [ ] **Data Fetching:** Fetch available quests from API.
- [ ] **Quest Log Window:**
  - [ ] Create tabbed view: "Active", "Completed".
  - [ ] Show quest details, rewards, and progress.
- [ ] **In-Post Quests:**
  - [ ] Create a "Quest Card" component to embed at the end of blog posts.
  - [ ] Implement "Accept Quest" button.

### 2. Inventory System

- [ ] **Data Model:** Update `useUser` to include `inventory` array.
- [ ] **Inventory UI:**
  - [ ] Create `InventoryWindow.tsx`.
  - [ ] Render grid of items with tooltips.
- [ ] **Item Gating:**
  - [ ] Create `ItemGate` wrapper component.
  - [ ] If user lacks item, show "Locked" state.
  - [ ] If user has item, render children (the hidden content).

---

## Phase 4: Polish and Expansion

- [ ] **Audio System:**
  - [ ] Create `AudioContext` (BGM track, SFX toggle).
  - [ ] Add sound assets for UI interactions (click, open, close).
- [ ] **Persistence:** Verify backend database integration for saving user progress.
- [ ] **Achievements:** Add visual badges to the Profile Window.

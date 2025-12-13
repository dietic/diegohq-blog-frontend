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
- [X] **Desktop Layout:**
    - [X] Refactor `Desktop.tsx` to serve as the main screen container.
    - [X] Implement responsive background handling.
- [ ] **Desktop Icons:**
    - [ ] Add double-click handler to open associated windows.
    - [ ] Style with pixel-perfect focus states.

### 3. Window Management System
- [ ] **Window Context:**
    - [ ] Create `WindowContext.tsx` to manage state: `openWindows`, `activeWindowId`, `minimizedWindows`.
    - [ ] Implement `openWindow(id, component)`, `closeWindow(id)`, `focusWindow(id)` actions.
- [ ] **Window Component (react-rnd):**
    - [ ] Refactor `Window.tsx` to wrap content in `<Rnd>` component.
    - [ ] internalize `defaultPosition` and `defaultSize`.
    - [ ] Bind `onDragStart` and `onMouseDown` to trigger `focusWindow`.
    - [ ] Implement Title Bar actions: Close, Minimize, Maximize.
    - [ ] Ensure "contained" drag behavior (windows cannot be dragged off-screen).

### 4. CMS & Content (Payload CMS)
- [ ] **Setup:**
    - [ ] Install `payload` and `react-hook-form` (if needed by Payload components).
    - [ ] Initialize Payload Config (`payload.config.ts`) in the root.
    - [ ] Configure Database (Postgres or MongoDB - Local or Cloud).
- [ ] **Collections:**
    - [ ] Define `Posts` Collection (Fields: Title, Slug, Publish Date, Content (Lexical/RichText), Tags, Author).
- [ ] **Integration:**
    - [ ] Ensure Next.js handles Payload routes (`/admin`, `/api/...`).
    - [ ] Create `src/lib/payload.ts` for strictly typed data fetching on the frontend.

### 5. Backend Integration
- [ ] **API Client:**
    - [ ] Create `src/lib/api.ts`.
    - [ ] Define Types/Interfaces for Game Metadata responses.
    - [ ] Implement `fetchGameMetadata()` to call Python backend.
- [ ] **Journal Window:**
    - [ ] Create `Journal.tsx` (to be rendered inside a Window).
    - [ ] Fetch post list from Payload CMS.
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
- [ ] **Auth Client:** Implement `login`, `register`, `logout` functions calling FastAPI.
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

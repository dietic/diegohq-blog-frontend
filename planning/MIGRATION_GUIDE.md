# Migration Guide: Tailwind to Plain SCSS

This document ensures that **NO design or functionality is lost** during the migration from Tailwind CSS to Standard SCSS. It serves as a checklist and reference for the cleanup tasks in Phase 1.

---

## 1. Current State Inventory

### 1.1. Existing Components

| Component         | Location                                      | Styling             | Functionality                                         |
| ----------------- | --------------------------------------------- | ------------------- | ----------------------------------------------------- |
| **Desktop**       | `src/stories/components/Desktop/`             | `Desktop.scss`      | Main container, renders Navbar + icons + children     |
| **DesktopIcon**   | `src/stories/components/DesktopIcon/`         | `DesktopIcon.scss`  | Draggable icons with Rnd, label overlay               |
| **Navbar**        | `src/stories/components/Navbar/`              | `Navbar.scss`       | Taskbar with logo, title, date, clock                 |
| **Window**        | `src/stories/components/Window/`              | `Window.scss`       | Draggable/resizable with Rnd, minimize/maximize/close |
| **WindowHeader**  | `src/stories/components/Window/WindowHeader/` | `WindowHeader.scss` | Title bar with action buttons                         |
| **WindowButton**  | `src/stories/components/Window/WindowButton/` | `WindowButton.scss` | Circular action buttons (close, minimize, maximize)   |
| **WindowContext** | `src/stories/components/Window/`              | N/A                 | Context for window size status                        |
| **Button**        | `src/stories/components/Button/`              | `Button.scss`       | Primary/outline variants, sizes                       |

### 1.2. Existing SCSS Files (Already Using CSS Variables ✅)

All SCSS files already reference CSS variables from `globals.css`. This is good!

**Current CSS Variables in `globals.css`:**

```css
:root {
  --radius-xs: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --button-primary: oklch(0.9021 0.134 165.84);
  --button-primary-border: oklch(0.7066 0.1637 158.07);
  --window-primary-bg: oklch(0.9861 0.0017 325.59);
  --window-primary-border: oklch(0.2768 0 0);
  --window-primary-header: oklch(0.3739 0.0599 264.04);
  --window-primary-header-foreground: oklch(0.9861 0.0017 325.59);
  --window-primary-action-bg: oklch(0.5252 0.0599 264.04);
  --window-primary-action-bg--hover: oklch(0.5252 0.0599 264.04 / 40%);
  --icon-primary-label-bg: oklch(0.3739 0.0599 264.04 / 80%);
}
```

### 1.3. Fonts Configuration

**Fonts defined in `src/app/fonts.ts`:**

- `pixelifySans` - `--font-pixelify-sans`
- `pressStart2P` - `--font-press-start-2p` (currently used in body)
- `vt323` - `--font-vt323` (used in WindowHeader, DesktopIcon, Navbar)
- `jersey25` - `--font-jersey-25`

**Also imported via Google Fonts URL in `globals.css`:**

- Jersey 25
- Pixelify Sans
- Press Start 2P
- Roboto Mono
- VT323

### 1.4. Public Assets

**Desktop Icons (`public/desktop-icons/`):**

- chest.png
- book.png
- mypc.png
- (possibly more)

**Other Assets:**

- `background.svg` - Desktop background
- `background-16-9.png`, `background-9-16.png` - Responsive backgrounds
- `logo-journal.png` - Navbar logo
- `diegohqlogo.png` - Brand logo

---

## 2. Tailwind Utilities Currently Used

The following Tailwind utility classes are used in components and **MUST BE REPLACED**:

### 2.1. Desktop.tsx

```tsx
<div className="p-8">  // padding: 2rem
```

### 2.2. Navbar.tsx

```tsx
<div className="flex flex-1 pl-4">       // display: flex; flex: 1; padding-left: 1rem
<div className="flex items-center">      // display: flex; align-items: center
<div className="flex-1 p-2">             // flex: 1; padding: 0.5rem
<div className="border-red rounded-lg flex-1 p-2">  // border-color: red; border-radius: 0.5rem; flex: 1; padding: 0.5rem
<div className="p-2">                    // padding: 0.5rem
```

### 2.3. page.tsx (Home)

```tsx
<div className="p-4">  // padding: 1rem
```

### 2.4. layout.tsx

```tsx
<body className={`${pressStart2P.className} antialiased`}>  // font-smoothing
```

---

## 3. Step-by-Step Migration Checklist

### Step 1: Create `theme.css` ✅ (Palette Preservation)

Create `src/app/theme.css` with ALL existing CSS variables:

```css
/* src/app/theme.css */

:root {
  /* === RADIUS === */
  --radius-xs: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;

  /* === BUTTON COLORS === */
  --button-primary: oklch(0.9021 0.134 165.84);
  --button-primary-border: oklch(0.7066 0.1637 158.07);

  /* === WINDOW COLORS === */
  --window-primary-bg: oklch(0.9861 0.0017 325.59);
  --window-primary-border: oklch(0.2768 0 0);
  --window-primary-header: oklch(0.3739 0.0599 264.04);
  --window-primary-header-foreground: oklch(0.9861 0.0017 325.59);
  --window-primary-action-bg: oklch(0.5252 0.0599 264.04);
  --window-primary-action-bg--hover: oklch(0.5252 0.0599 264.04 / 40%);

  /* === ICON COLORS === */
  --icon-primary-label-bg: oklch(0.3739 0.0599 264.04 / 80%);

  /* === SPACING (from design tokens) === */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.5rem; /* 24px */
  --space-6: 2rem; /* 32px */
  --space-8: 3rem; /* 48px */
}
```

### Step 2: Create SCSS Partials

**`src/styles/_variables.scss`:**

```scss
// Breakpoints
$bp-mobile: 480px;
$bp-tablet: 768px;
$bp-desktop: 1024px;
$bp-wide: 1280px;

// Font stacks
$font-pixel: 'VT323', 'Press Start 2P', monospace;
$font-readable: 'Inter', 'Roboto', sans-serif;
$font-mono: 'Roboto Mono', monospace;
```

**`src/styles/_mixins.scss`:**

```scss
@mixin desktop {
  @media (min-width: 1024px) {
    @content;
  }
}

@mixin mobile {
  @media (max-width: 1023px) {
    @content;
  }
}

@mixin pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Step 3: Replace Tailwind Utilities in Components

#### Desktop.tsx

**Before:**

```tsx
<div className="p-8">
```

**After:**

```tsx
<div className="hq-desktop--content">
```

**Add to Desktop.scss:**

```scss
.hq-desktop {
  // existing...

  &--content {
    padding: var(--space-6); // 2rem = 32px
  }
}
```

#### Navbar.tsx

**Before:**

```tsx
<div className="flex flex-1 pl-4">
  <div className="flex items-center">
  <div className="flex-1 p-2">
<div className="border-red rounded-lg flex-1 p-2">
<div className="p-2">
```

**After:**

```tsx
<div className="hq-navbar--left">
  <div className="hq-navbar--logo">
  <div className="hq-navbar--title">
<div className="hq-navbar--date">
<div className="hq-navbar--time">
```

**Add to Navbar.scss:**

```scss
.hq-navbar {
  // existing...

  &--left {
    display: flex;
    flex: 1;
    padding-left: var(--space-4);
  }

  &--logo {
    display: flex;
    align-items: center;
  }

  &--title {
    flex: 1;
    padding: var(--space-2);
  }

  &--date {
    flex: 1;
    padding: var(--space-2);
    border-radius: var(--radius-lg);
  }

  &--time {
    padding: var(--space-2);
  }
}
```

#### page.tsx (Home)

**Before:**

```tsx
<div className="p-4">
```

**After:**

```tsx
<div className="hq-window--content-inner">
```

Or simply use inline style if it's temporary demo content.

#### layout.tsx

**Before:**

```tsx
<body className={`${pressStart2P.className} antialiased`}>
```

**After:**

```tsx
<body className={pressStart2P.className}>
```

**Add to globals.css:**

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 4: Update globals.css

**After Tailwind removal:**

```css
/* src/app/globals.css */

/* Import theme variables */
@import './theme.css';

/* Import Google Fonts (keep this) */
@import url('https://fonts.googleapis.com/css2?family=Jersey+25&family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=VT323&display=swap');

/* Base resets */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-position: center center;
}
```

### Step 5: Uninstall Tailwind

```bash
pnpm remove tailwindcss postcss autoprefixer tw-animate-css
```

Delete files:

- `tailwind.config.ts` (if exists)
- `postcss.config.mjs` (or modify to only include needed plugins)

---

## 4. Functionality Preservation Checklist

### 4.1. Window Component

- [x] Drag and drop (via `react-rnd`) — uses `dragHandleClassName="hq-window--header"`
- [x] Resize — via `react-rnd`
- [x] Minimize — toggles `isMinimized` state, applies `hq-window--minimized` class
- [x] Maximize — toggles `isMaximized` state, applies `hq-window--maximized` class
- [x] Close — sets `isClosed` to true, calls `onClose` callback
- [x] Viewport resize handling — `useEffect` with resize listener
- [x] Restore from maximized on drag — detects movement > 2px

### 4.2. DesktopIcon Component

- [x] Drag and drop (via `react-rnd`)
- [x] Initial position (`initialX`, `initialY`)
- [x] Icon image display
- [x] Label with background overlay

### 4.3. Navbar Component

- [x] Live clock (updates every second)
- [x] Formatted date display
- [x] Logo display

### 4.4. WindowContext

- [x] Context for window size status (`NORMAL`, `MAXIMIZED`, `MINIMIZED`)
- [x] Provider wrapper

### 4.5. Button Component

- [x] Variant styling (`primary`, `outline`)
- [x] Size variants (`xs`, `md`, `lg`)
- [x] Active state animations

---

## 5. Visual Design Preservation Checklist

### 5.1. Colors (MUST MATCH)

| Element             | Variable                             | Value                               |
| ------------------- | ------------------------------------ | ----------------------------------- |
| Window Background   | `--window-primary-bg`                | `oklch(0.9861 0.0017 325.59)`       |
| Window Border       | `--window-primary-border`            | `oklch(0.2768 0 0)`                 |
| Window Header       | `--window-primary-header`            | `oklch(0.3739 0.0599 264.04)`       |
| Header Text         | `--window-primary-header-foreground` | `oklch(0.9861 0.0017 325.59)`       |
| Action Button BG    | `--window-primary-action-bg`         | `oklch(0.5252 0.0599 264.04)`       |
| Action Button Hover | `--window-primary-action-bg--hover`  | `oklch(0.5252 0.0599 264.04 / 40%)` |
| Button Primary      | `--button-primary`                   | `oklch(0.9021 0.134 165.84)`        |
| Button Border       | `--button-primary-border`            | `oklch(0.7066 0.1637 158.07)`       |
| Icon Label BG       | `--icon-primary-label-bg`            | `oklch(0.3739 0.0599 264.04 / 80%)` |

### 5.2. Dimensions (MUST MATCH)

| Element                 | Property        | Value                        |
| ----------------------- | --------------- | ---------------------------- |
| Window min-height       | `min-height`    | `5rem` (80px)                |
| Window min-width        | `min-width`     | `15rem` (240px)              |
| Window header height    | `height`        | `40px`                       |
| Minimized window height | `height`        | `40px`                       |
| Minimized window width  | `width`         | `250px`                      |
| Window border radius    | `border-radius` | `var(--radius-md)` (0.25rem) |

### 5.3. Fonts (MUST MATCH)

| Context            | Font           |
| ------------------ | -------------- |
| Body (default)     | Press Start 2P |
| Window Title       | VT323          |
| Desktop Icon Label | VT323          |
| Navbar             | VT323          |
| Button             | Roboto Mono    |

### 5.4. Animations & Transitions

| Element       | Property     | Value              |
| ------------- | ------------ | ------------------ |
| Button        | `transition` | `0.1s all ease-in` |
| Button active | `transform`  | `scale(0.98)`      |

---

## 6. Testing After Migration

Run the following checks after completing migration:

### Visual Regression

- [ ] Desktop background displays correctly
- [ ] Desktop icons are draggable and display labels
- [ ] Navbar shows logo, title, date, and clock
- [ ] Clock updates every second
- [ ] Window opens with correct styling
- [ ] Window is draggable by header
- [ ] Window is resizable
- [ ] Minimize button works (window collapses)
- [ ] Maximize button works (window fills screen)
- [ ] Close button works (window disappears)
- [ ] Restore from maximize by dragging works
- [ ] Window action buttons show icon on hover
- [ ] Button primary variant has correct color and shadow
- [ ] Button outline variant has correct border

### Responsive

- [ ] Desktop layout works on large screens
- [ ] No horizontal scroll on mobile

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states are visible

---

## 7. Post-Migration File Structure

After migration, the structure should be:

```
src/
├── app/
│   ├── fonts.ts          # next/font definitions
│   ├── globals.css       # Base styles, resets
│   ├── theme.css         # CSS variables (colors, spacing)
│   ├── layout.tsx
│   └── page.tsx
├── styles/
│   ├── _variables.scss   # SCSS variables (breakpoints, font stacks)
│   └── _mixins.scss      # SCSS mixins (responsive, pixel-art)
└── components/           # Moved from stories/components
    ├── Button/
    │   ├── Button.tsx
    │   └── Button.scss
    ├── Desktop/
    │   ├── Desktop.tsx
    │   └── Desktop.scss
    ├── DesktopIcon/
    │   ├── DesktopIcon.tsx
    │   └── DesktopIcon.scss
    ├── Navbar/
    │   ├── Navbar.tsx
    │   └── Navbar.scss
    └── Window/
        ├── Window.tsx
        ├── Window.scss
        ├── WindowContext.tsx
        ├── WindowHeader/
        │   ├── WindowHeader.tsx
        │   └── WindowHeader.scss
        └── WindowButton/
            ├── WindowButton.tsx
            └── WindowButton.scss
```

---

## 8. Dependencies to Keep

```json
{
  "dependencies": {
    "react-rnd": "^x.x.x",
    "@nsmr/pixelart-react": "^x.x.x",
    "next": "^16.x.x",
    "react": "^19.x.x"
  },
  "devDependencies": {
    "sass": "^x.x.x"
  }
}
```

**Remove:**

- `tailwindcss`
- `postcss` (unless needed for other plugins)
- `autoprefixer`
- `tw-animate-css`

---

## 9. Notes

1. **Plain SCSS Enforcement:** The current components use regular SCSS imports (`import './Window.scss'`). This is CORRECT. Do NOT convert to SCSS Modules. Ensure all new components follow this pattern.

2. **BEM Naming:** Current SCSS already follows BEM-like naming (`hq-window--header`). Keep this convention to avoid global namespace collisions.


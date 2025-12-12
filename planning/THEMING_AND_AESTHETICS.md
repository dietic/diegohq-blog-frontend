# Theming and Aesthetics Guide

This guide defines the visual and audio identity of "The Adventurer's Journal."

## 1. Visual Style: "Soft Pixel Art"

The primary aesthetic is inspired by Game Boy Advance (GBA) and SNES RPGs, but with a softer, more modern touch.

- **Color Palette:**
  - Avoid harsh, pure-black outlines. Opt for dark, saturated colors for borders (e.g., dark purple, deep blue, dark brown).
  - The palette should be slightly desaturated and favor earthy or pastel tones over vibrant neon colors.
  - Key Colors (Preserved in `src/app/theme.css`):
    - **Button Primary:** `oklch(0.9021 0.134 165.84)`
    - **Button Border:** `oklch(0.7066 0.1637 158.07)`
    - **Window Background:** `oklch(0.9861 0.0017 325.59)`
    - **Window Border:** `oklch(0.2768 0 0)`
    - **Window Header:** `oklch(0.3739 0.0599 264.04)`
    - **Window Action BG:** `oklch(0.5252 0.0599 264.04)`
- **Pixel Art Rules:**
  - Maintain a consistent pixel density. All assets should look like they belong in the same "game."
  - UI elements (buttons, icons, window frames) should be chunky and clear.
  - Icons should be easily recognizable at small sizes (e.g., 32x32 or 48x48 pixels).

- **Font:**
  - A primary pixel font must be chosen. It needs to be highly readable for long-form blog content.
  - Recommended to find a font that supports common weights (regular, bold) and special characters.
  - Examples: "Silkscreen," "Press Start 2P," or a custom-made font.

## 2. Interface & Layout

- **Desktop Background:** A simple, non-distracting pixel art background. Could be a subtle pattern or a landscape that changes based on the time of day.
- **Icons:** Themed around a fantasy/adventure setting.
  - `My Profile`: A person/hero icon.
  - `Journal`: A book or scroll icon.
  - `Quests`: A map or compass icon.
  - `Inventory`: A treasure chest or backpack icon.
- **Windows (Desktop Mode):**
  - Classic OS design: Title bar with minimize, maximize, and close buttons.
  - A subtle drop shadow to give depth.
  - Status bar at the bottom for extra info if needed.
- **Mobile "Handheld" Mode (Dual Interface):**
  - **Concept:** Instead of shrinking the desktop, the UI transforms into a "Handheld Console" or Pokedex interface.
  - **Navigation:** Draggable windows are replaced by full-screen "Apps" with a bottom tab bar or "Start Menu" drawer.
  - **Touch Targets:** Buttons and icons are enlarged for touch friendliness (minimum 44x44px).
  - **Layout:** Single-column layout for reading posts, optimized for vertical scrolling.

## 3. Audio Design

Audio is crucial for immersion but should not be intrusive.

- **Background Music (BGM):**
  - A single, long, looping track.
  - Style: Lo-fi chiptune, calm and atmospheric. It should aid concentration, not distract.
  - The music should be quiet by default.
- **Sound Effects (SFX):**
  - **Style:** Soft, 8-bit/16-bit sounds. Avoid sharp, jarring noises.
  - **Key Sounds:**
    - Open/Close Window: A soft "swoosh" or "click."
    - Button Click: A gentle "boop."
    - Quest Complete: A positive, short fanfare (e.g., Zelda "item get" sound).
    - Level Up: A more significant, celebratory sound effect.
    - Receive Item: A magical "shimmer" sound.
    - Error: A muted, low-pitched "buzz" or "thud."
- **Audio Controls:**
  - A master volume control or separate toggles for BGM and SFX must be easily accessible at all times.

---

## 4. Design Tokens

Design tokens are the atomic values that define the visual language of the project. All tokens are defined as CSS custom properties in `src/app/theme.css` and should be referenced throughout the codebase.

### 4.1. Spacing Scale

A consistent spacing scale based on a **4px base unit** ensures visual harmony.

| Token        | Value  | Usage                           |
| ------------ | ------ | ------------------------------- |
| `--space-0`  | `0`    | No spacing                      |
| `--space-1`  | `4px`  | Tight spacing (inline elements) |
| `--space-2`  | `8px`  | Small gaps (icon padding)       |
| `--space-3`  | `12px` | Default padding                 |
| `--space-4`  | `16px` | Component padding               |
| `--space-5`  | `24px` | Section spacing                 |
| `--space-6`  | `32px` | Large gaps                      |
| `--space-8`  | `48px` | Layout spacing                  |
| `--space-10` | `64px` | Major section breaks            |
| `--space-12` | `96px` | Page-level spacing              |

**Usage Example:**

```scss
.window {
  padding: var(--space-4);
  gap: var(--space-3);
}
```

### 4.2. Typography Scale

Typography follows a modular scale for consistent hierarchy. The pixel font requires specific sizing to avoid blurriness.

| Token         | Size   | Line Height | Usage                    |
| ------------- | ------ | ----------- | ------------------------ |
| `--text-xs`   | `8px`  | `12px`      | Tiny labels, badges      |
| `--text-sm`   | `10px` | `14px`      | Secondary text, captions |
| `--text-base` | `12px` | `18px`      | Body text, paragraphs    |
| `--text-lg`   | `14px` | `20px`      | Emphasized text          |
| `--text-xl`   | `16px` | `24px`      | Subheadings              |
| `--text-2xl`  | `20px` | `28px`      | Section titles           |
| `--text-3xl`  | `24px` | `32px`      | Page titles              |
| `--text-4xl`  | `32px` | `40px`      | Hero text                |

**Font Families:**
| Token | Value | Usage |
|-------|-------|-------|
| `--font-pixel` | `'Silkscreen', 'Press Start 2P', monospace` | Primary UI font |
| `--font-readable` | `'Inter', 'Roboto', sans-serif` | Reader Mode / accessibility |
| `--font-mono` | `'JetBrains Mono', monospace` | Code blocks, Terminal |

**Font Weights:**
| Token | Value |
|-------|-------|
| `--font-normal` | `400` |
| `--font-bold` | `700` |

### 4.3. Color Tokens

Colors are organized by semantic purpose, not visual value. This allows for easy theming.

**Surface Colors:**
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-bg-desktop` | `oklch(0.25 0.02 260)` | Desktop background |
| `--color-bg-window` | `oklch(0.9861 0.0017 325.59)` | Window body background |
| `--color-bg-window-header` | `oklch(0.3739 0.0599 264.04)` | Window title bar |
| `--color-bg-window-action` | `oklch(0.5252 0.0599 264.04)` | Window action buttons area |
| `--color-bg-taskbar` | `oklch(0.30 0.03 260)` | Taskbar background |

**Interactive Colors:**
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-btn-primary` | `oklch(0.9021 0.134 165.84)` | Primary button background |
| `--color-btn-primary-border` | `oklch(0.7066 0.1637 158.07)` | Primary button border |
| `--color-btn-hover` | Lighten by 5% | Button hover state |
| `--color-btn-active` | Darken by 5% | Button pressed state |

**Border Colors:**
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-border-window` | `oklch(0.2768 0 0)` | Window frame border |
| `--color-border-subtle` | `oklch(0.7 0 0)` | Dividers, separators |
| `--color-border-focus` | `oklch(0.65 0.15 250)` | Focus ring color |

**Text Colors:**
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-text-primary` | `oklch(0.20 0 0)` | Main body text |
| `--color-text-secondary` | `oklch(0.45 0 0)` | Muted/secondary text |
| `--color-text-inverse` | `oklch(0.98 0 0)` | Text on dark backgrounds |
| `--color-text-link` | `oklch(0.55 0.15 250)` | Hyperlinks |

**Semantic Colors:**
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-success` | `oklch(0.70 0.15 145)` | Quest complete, XP gain |
| `--color-warning` | `oklch(0.75 0.15 85)` | Caution states |
| `--color-error` | `oklch(0.60 0.20 25)` | Error messages |
| `--color-info` | `oklch(0.65 0.12 250)` | Informational messages |

### 4.4. Shadow Tokens

Shadows add depth while maintaining the pixel-art aesthetic. Use subtle, blocky shadows.

| Token            | Value                             | Usage                   |
| ---------------- | --------------------------------- | ----------------------- |
| `--shadow-sm`    | `2px 2px 0 rgba(0,0,0,0.15)`      | Buttons, small elements |
| `--shadow-md`    | `4px 4px 0 rgba(0,0,0,0.20)`      | Windows, cards          |
| `--shadow-lg`    | `8px 8px 0 rgba(0,0,0,0.25)`      | Modals, focused windows |
| `--shadow-inner` | `inset 2px 2px 0 rgba(0,0,0,0.1)` | Pressed button states   |

**Note:** Shadows should be hard-edged (no blur) to maintain pixel-art consistency.

### 4.5. Border Radius

Minimal border radius keeps the retro aesthetic. Most elements should have sharp corners.

| Token           | Value    | Usage                       |
| --------------- | -------- | --------------------------- |
| `--radius-none` | `0`      | Default, most elements      |
| `--radius-sm`   | `2px`    | Subtle rounding (buttons)   |
| `--radius-md`   | `4px`    | Cards, windows (if rounded) |
| `--radius-full` | `9999px` | Circular elements (badges)  |

### 4.6. Z-Index Scale

A managed z-index scale prevents stacking context chaos.

| Token               | Value | Usage                   |
| ------------------- | ----- | ----------------------- |
| `--z-base`          | `0`   | Default layer           |
| `--z-dropdown`      | `100` | Dropdown menus          |
| `--z-window`        | `200` | Window base layer       |
| `--z-window-active` | `250` | Focused/active window   |
| `--z-modal`         | `300` | Modal dialogs           |
| `--z-tooltip`       | `400` | Tooltips, popovers      |
| `--z-taskbar`       | `500` | Taskbar (always on top) |
| `--z-notification`  | `600` | Toast notifications     |

### 4.7. Animation Tokens

Consistent timing for animations and transitions.

| Token               | Value                                    | Usage                      |
| ------------------- | ---------------------------------------- | -------------------------- |
| `--duration-fast`   | `100ms`                                  | Micro-interactions (hover) |
| `--duration-normal` | `200ms`                                  | Standard transitions       |
| `--duration-slow`   | `400ms`                                  | Complex animations         |
| `--easing-default`  | `ease-out`                               | Default easing             |
| `--easing-bounce`   | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful interactions       |

**Reduce Motion:**

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.8. Breakpoints

Responsive breakpoints for the dual-interface strategy.

| Token          | Value    | Description           |
| -------------- | -------- | --------------------- |
| `--bp-mobile`  | `480px`  | Small phones          |
| `--bp-tablet`  | `768px`  | Tablets, large phones |
| `--bp-desktop` | `1024px` | Desktop mode trigger  |
| `--bp-wide`    | `1280px` | Wide screens          |

**SCSS Mixin:**

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
```

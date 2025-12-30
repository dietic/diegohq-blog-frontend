# Features List

This document outlines the key features of "The Adventurer's Journal."

## 1. UI & Core Experience

- **Retro OS Interface:**
  - A pixel-art graphical user interface that mimics a classic desktop environment.
  - **Desktop Icons:** Main navigation elements (e.g., `My Profile`, `Journal`, `Quests`) — fully configurable via CMS.
  - **Windowing System:** All content (posts, profiles, etc.) opens in draggable, resizable, and minimizable windows.
  - **Start Bar / Taskbar:** A persistent UI element at the bottom of the screen showing the user's current Level, XP bar, and shortcuts.
- **CMS-Managed Desktop:**
  - Desktop icons are defined in `content/desktop/icons.json` and loaded dynamically.
  - Each icon specifies: label, icon image, position, window type, and optional gating.
  - Built-in window types: `journal`, `quest-log`, `inventory`, `profile`, `settings`.
  - Custom window types render MDX content from `content/desktop/windows/`.
  - Icons can be level-gated or item-gated (hidden until user meets requirements).
  - External links open in new tabs (`windowType: 'external'`).
- **User Profile Window:**
  - Displays character name/avatar.
  - Shows current Level and an XP progress bar.
  - **Inventory Tab:** A grid showing all earned items (potions, swords, keys, etc.).
  - **Stats Tab:** Could show simple stats like "Posts Read," "Quests Completed."

## 2. Gamification Mechanics

- **Experience Points (XP):**
  - Awarded for reading posts, completing quests, and finishing challenges.
  - The primary metric for user progression.
- **Leveling System:**
  - Users start at Level 1.
  - Each level has an increasing XP requirement.
  - A level-up notification and sound effect celebrate the milestone.
- **Quest & Challenge System:**
  - **Quests:** Simple, single-task objectives tied to a journal entry (e.g., multiple-choice questions, simple text input).
  - **Challenges:** More complex, multi-step objectives that may span several posts.
  - A dedicated **Quest Log Window** allows users to track active and completed quests.
- **Inventory & Items:**
  - Virtual items are earned as quest rewards.
  - Items have a name, an icon, and a description.
  - They function as "keys" to unlock item-gated content.

## 3. Content Delivery

- **Custom CMS:**
  - Git-based content management using MDX/JSON files with Zod schemas.
  - Content stored in `content/` directory (desktop icons, windows, posts, quests, items).
  - Type-safe frontmatter validation at build time and runtime.
  - See `CUSTOM_CMS.md` for full architecture.
- **Admin Interface:**
  - Protected `/admin` route for content management.
  - **Desktop Manager:** Visual grid editor for icon positions, create/edit icons and custom windows.
  - **Content Manager:** Create, edit, and delete posts, quests, and items.
  - Live MDX preview for post and window editing.
  - Server Actions for file system operations.
- **Journal Window:**
  - Lists all available journal entries (blog posts).
  - Displays posts in a readable format within a "text editor" or "document" styled window.
  - MDX rendering with custom components (QuestCard, Callout, CodeBlock).
- **Content Gating:**
  - **Level-Gated Posts:** A post is unreadable until the user reaches a specific level. The UI will show the requirement (e.g., "LVL 5 Required").
  - **Item-Gated Posts:** A post is locked behind a specific challenge. The UI shows the challenge (e.g., "A dragon blocks the path") and the item required to bypass it (e.g., "Requires: Dragon-Slaying Sword"). Unlocking the post is an interactive event.

## 4. Audio & Visuals (Theming)

- **Pixel Art:** All visual components will be designed in a consistent, soft pixel-art style.
- **Custom Pixel Font:** A readable and theme-appropriate font.
- **Sound Effects (SFX):** Short, 8-bit sounds for UI interactions (opening windows, clicks, errors, notifications).
- **Music (BGM):** A subtle, looping chiptune or lo-fi track to enhance immersion.
- **Audio Controls:** Users can mute or adjust the volume of SFX and BGM independently.

## 5. Productivity Tools (Dev-Focused)

- **Global "Spotlight" Search:**
  - A powerful search bar accessible via `Ctrl + K`.
  - Allows instant searching of Post Titles, Tags, and Active Quests.
  - Navigates directly to the content without manually opening windows.
- **Terminal App:**
  - A CLI-style window allowing users to navigate the blog using text commands.
  - Supported commands: `ls` (list posts), `cd` (change category), `cat [post-name]` (read post), `whoami` (show stats).

## 6. Accessibility & Settings

- **"Reader Mode" Override:**
  - A "Settings" toggle that switches the font from pixel-art style to a standard, high-legibility Sans-Serif font (e.g., Inter or Roboto).
  - Removes pixelated UI borders for a cleaner reading experience.
- **Reduce Motion:**
  - Option to disable window opening animations and other non-essential motion effects.
- **Plain HTML Fallback:**
  - Ensures core content is accessible even if JavaScript fails or for strict screen reader users.

## 7. Mobile Responsiveness (Handheld Mode)

- **Dual Interface Strategy:**
  - **Desktop:** The full "Retro OS" experience with draggable windows.
  - **Mobile:** A streamlined "Handheld Console" interface (inspired by GameBoy/Pokedex).
  - **Navigation:** Uses a bottom navigation bar or stack-based navigation instead of floating windows.

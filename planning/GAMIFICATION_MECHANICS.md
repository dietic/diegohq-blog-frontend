# Gamification Mechanics

This document details the rules and systems that power the game aspect of the journal.

## 1. Core Progression

### Experience Points (XP)

XP is the fundamental unit of progression. The amounts should be balanced to feel rewarding but not trivial.

- **Earning XP:**
  - **Reading a Post:** A small, flat amount (e.g., **10 XP**) is awarded automatically upon scrolling to the end of an entry.
  - **Completing a Quest:** A moderate amount (e.g., **30-50 XP**) is awarded for correctly answering a quiz or completing a simple task.
  - **Completing a Challenge:** A large amount (e.g., **100-250 XP**) is awarded for finishing a multi-step objective.

### Levels

Levels represent the user's overall progress and are the primary way to unlock content.

- **Level Curve:** The XP required to level up should increase with each level. A suggested formula is `XP_for_next_level = (current_level ^ 1.5) * 100`.
  - `Level 1 -> 2:` 100 XP
  - `Level 2 -> 3:` 282 XP
  - `Level 3 -> 4:` 520 XP
  - ...and so on.
- **Rewards:** Leveling up should trigger a visual and audio celebration. It is the main prerequisite for accessing level-gated content.

## 2. Content Unlocking Mechanisms

### Level-Gating

This is the simplest form of content locking.

- **Implementation:** Every post has an optional `requiredLevel` property.
- **User Experience:** If `user.level < post.requiredLevel`, the post's content is obscured or replaced with a message like, "You must reach Level [X] to read this entry."

### Item-Gating

This is a more interactive form of content locking that creates a sense of accomplishment.

- **Implementation:**
  1. A post has an optional `requiredItem` property (e.g., `itemId: 'fire_potion'`).
  2. The post also has "challenge text" (e.g., "A wall of ice blocks this ancient script.").
  3. If the user does not have the item in their inventory, they see the challenge text.
  4. If the user **does** have the item, a button appears: "Use [Item Name]". Clicking it permanently unlocks the post for that user.
- **Items:**
  - Items are virtual objects stored in the user's inventory.
  - Each item has a unique ID, a name, and an icon.
  - They are awarded exclusively as quest or challenge rewards. They cannot be acquired otherwise.

## 3. Quest Design

Quests are the primary way users earn significant XP and acquire key items.

- **Structure of a Quest:**
  - **Host Post:** Each quest is attached to a specific journal entry.
  - **Prompt:** A clear question or instruction presented after the post content.
  - **Type:**
    - **Multiple Choice:** The user selects one answer from a list.
    - **Simple Text Input:** The user types a short, specific answer (less common, harder to validate).
    - **Call to Action:** A simple "I've done this" checkbox for external tasks (honor system).
  - **Reward:**
    - `xpReward` (e.g., 50).
    - `itemReward` (optional, e.g., `itemId: 'key_of_knowledge'`).

## 4. Engagement Hooks & Retention

To encourage daily engagement and long-term play.

-   **Daily Login Bonus ("The Daily Chest"):**
    -   A treasure chest icon appears on the desktop once every 24 hours.
    -   Clicking it awards a small XP bonus (e.g., +5 XP) or a consumable item.
    -   Encourages users to check the site even if no new post is up.

## 5. Secrets & Easter Eggs

-   **Konami Code:**
    -   Entering `Up, Up, Down, Down, Left, Right, Left, Right, B, A` on the keyboard triggers a special effect.
    -   **Reward:** A unique "Cheat Code" achievement, a temporary visual theme change (e.g., "God Mode" color palette), or access to a hidden "Dev Room" post.

## 6. Persistence & Data

-   **Local Storage (MVP):**
    -   Initially, game progress (XP, Level, Inventory) is saved in the browser's `localStorage`.
-   **Cloud Save ("Memory Card"):**
    -   Future implementation using authentication (e.g., NextAuth).
    -   Allows users to log in and sync their progress across devices (Desktop to Mobile).
    -   Essential for preventing data loss if cache is cleared.

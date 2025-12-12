# MVP Rollout Plan

This document outlines a phased approach to building "The Adventurer's Journal," allowing for iterative development and testing.

## Phase 1: The Core Journal & OS (Minimum Viable Product)

The goal of this phase is to build a functional, themed blog without the complex game mechanics. This allows for content creation to begin immediately.

-   **Key Objectives:**
    -   [ ] Set up the Next.js project structure.
    -   [ ] **CMS Setup:** Initialize **Payload CMS** (Next.js Native) for writing Blog Posts (Lexical/RichText).
    -   [ ] **Backend Integration:** Create API Client to fetch Game Metadata from Python Backend (`/content/posts`).
    -   [ ] Create the main "Desktop" layout.
    -   [ ] **Preserve Color Palette:** Extract current Tailwind-based color variables to a standalone CSS file (`src/app/theme.css`) before removing Tailwind.
    -   [ ] Implement the **Windowing System**: Use `react-rnd` for drag-and-drop window management.
    -   [ ] Design and build the **Journal Window** to fetch posts from Payload CMS + Python Backend.
    -   [ ] Create the basic visual assets in the chosen pixel-art style (icons, window frames).
    -   [ ] Establish the core CSS/SCSS for the retro theme (refactoring existing components `Desktop`, `Window`, `Navbar`, etc.).
-   **Gamification:** None in this phase. The focus is purely on the user interface and content delivery.
-   **Outcome:** A visually unique blog powered by Payload CMS (Content) and Python (Data).

---

## Phase 1.5: UX, Mobile & Onboarding (Critical Polish)

Before diving into complex gamification, ensure the base experience is usable and welcoming.

-   **Key Objectives:**
    -   [ ] Implement **Dual Interface Strategy**: Build the specific mobile layout ("Handheld Mode").
    -   [ ] Create **"Tutorial Island" Onboarding**:
        -   A first-time visitor sequence (BIOS boot-up animation).
        -   A "Helper" sprite that guides the user to the Journal and Quest Log.
    -   [ ] Implement **Accessibility Features**:
        -   Add the "Reader Mode" toggle (switch to Sans-Serif font).
        -   Ensure keyboard navigation works for windows and icons.
    -   [ ] Add **Productivity Tools**: Implement the `Ctrl + K` "Spotlight" search.
-   **Outcome:** A highly accessible and responsive site that guides new users effectively.

---

## Phase 2: Introducing Progression

This phase introduces the core feedback loop of earning XP and leveling up.

-   **Key Objectives:**
    -   [ ] **Authentication:** Implement User Registration/Login using **FastAPI Backend**.
    -   [ ] **User State:** Create `useUser` hook to fetch profile (`xp`, `level`) from Python API.
    -   [ ] Develop the **XP and Leveling System**.
        -   The backend logic resides in the Python API.
    -   [ ] Grant XP for reading a post (call `POST /api/v1/game/read-post`).
    -   [ ] Build the **User Profile Window** to display the user's level and XP bar.
    -   [ ] Create the visual and audio feedback for leveling up.
    -   [ ] Implement **Level-Gating**: Hide or lock posts based on the user's level (data from API).
-   **Outcome:** The blog now has a progression system with real user persistence.

---

## Phase 3: The Full Gameplay Loop

This phase completes the vision by adding the interactive quest and item systems.

-   **Key Objectives:**
    -   [ ] **Data Integration:** Fetch Quests and Items from Python API.
    -   [ ] Design and build the **Quest System** at the end of posts.
    -   [ ] Implement the **Inventory System**:
        -   Render `user.inventory` from the API response.
    -   [ ] Create a new tab in the User Profile window to show the inventory.
    -   [ ] Implement **Item-Gating**: Lock posts behind challenges that require specific items (logic check against API data).
    -   [ ] Build the **Quest Log Window** to track active and completed quests.

-   **Outcome:** The project is now a fully-featured, gamified journal as per the original vision.

---

## Phase 4: Polish and Expansion (Post-Launch)

After the core experience is complete, these features can be added to enhance immersion and user retention.

-   **Potential Features:**
    -   [ ] Add background music and sound effects with volume controls.
    -   [ ] Create more complex, multi-step **Challenges**.
    -   [ ] Add a "Stats" or "Achievements" page to the user profile.
    -   [ ] Implement a backend with a database to persist user data across devices.
    -   [ ] Add animations and visual flair to UI interactions.

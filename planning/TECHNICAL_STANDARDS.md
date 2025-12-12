# Technical Standards & Coding Guidelines

This document serves as the "source of truth" for all development on the **DiegoHQ Blog Frontend**. All AI agents and developers must adhere to these standards to ensure consistency, maintainability, and performance.

---

## 1. Tech Stack & Versioning

-   **Frontend:** Next.js 16+ (App Router).
-   **Content CMS:** Keystatic (Git-based, Markdown).
-   **Game Backend:** Python FastAPI (External API).
-   **Language:** TypeScript (Strict Mode).
-   **Library:** React 19+ (Functional Components only).
-   **Window Management:** `react-rnd`.
-   **Styling:** SCSS Modules (`.module.scss`) or SCSS with BEM naming.
-   **Testing:** Vitest (Unit) + Storybook (Component Isolation).
-   **Package Manager:** `pnpm`.

---

## 2. Component Architecture

### 2.1. File Structure (Co-location)
All components must be self-contained in their own directory within `src/components/`.

```
src/components/
└── Window/
    ├── Window.tsx          # Component Logic
    ├── Window.module.scss  # Component Styling (Scoped)
    ├── Window.stories.tsx  # Storybook Documentation
    └── Window.test.tsx     # Vitest Unit Tests
```

### 2.2. Component Syntax
-   **Pattern:** Use **Arrow Functions** for all components.
-   **Exports:** Use **Named Exports** (avoid `default` exports to make refactoring easier).
-   **Props:** explicitly typed with an `interface` named `[ComponentName]Props`.

```tsx
// ✅ GOOD
import styles from './Window.module.scss';

interface WindowProps {
  title: string;
  isOpen: boolean;
}

export const Window = ({ title, isOpen }: WindowProps) => {
  return (
    <div className={styles.window}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};
```

```tsx
// ❌ BAD
export default function Window(props: any) { ... } // No default export, no 'any'
```

### 2.3. Server vs. Client Components
-   **Default:** All components are **Server Components** by default.
-   **Client:** Only add `'use client'` at the top of the file if the component uses:
    -   Event listeners (`onClick`, `onChange`).
    -   React Hooks (`useState`, `useEffect`).
    -   Browser-only APIs (`window`, `localStorage`).

---

## 3. Styling Strategy: SCSS Modules & Pixel Art

Since we are building a Retro OS, precise control over CSS is required.

-   **Palette Preservation:** The project's color palette (originally Tailwind-based) is preserved in `src/app/theme.css`. All components should reference these CSS variables (e.g., `var(--window-primary-bg)`) to ensure consistency.
-   **Methodology:** Use **SCSS Modules** (`.module.scss`) to scope styles to the component.
-   **Naming:** Use descriptive class names (camelCase for module access, kebab-case in SCSS).
-   **Pixel Art Specifics:**
    -   Images/Icons must use: `image-rendering: pixelated;`.
    -   Fonts must be imported via `next/font` (e.g., Press Start 2P or Silkscreen) and applied via a class.

---

## 4. TypeScript Rules

-   **Strict Mode:** Enabled.
-   **Explicit Types:** Return types for complex functions should be explicit.
-   **No `any`:** usage of `any` is strictly prohibited. Use `unknown` or define a generic if the type is truly dynamic.
-   **Interfaces:** Prefer `interface` over `type` for public props and object definitions (better error messages and extensibility).

---

## 5. State Management

-   **Local State:** `useState` / `useReducer` for component-level logic.
-   **Auth & User Data:** JWT Token (from FastAPI). User profile (`xp`, `level`) is fetched from `/api/v1/users/me`.
-   **Global State:** React Context API (e.g., `WindowContext`, `ThemeContext`).
-   **URL State:** For shareable state (e.g., active tab, selected post), prefer storing state in the URL Search Params (`useSearchParams`).

---

## 6. Testing Guidelines

-   **Unit Tests (Vitest):** Test logic, utility functions, and hooks.
-   **Component Tests (Storybook/Vitest):**
    -   Every UI component **MUST** have a corresponding `.stories.tsx` file.
    -   Stories should cover the "Happy Path" and "Edge Cases" (e.g., Loading, Empty, Error).

---

## 7. Formatting & Quality

-   **Prettier:** Run `pnpm format` before committing.
-   **Linting:** Run `pnpm lint` to catch Next.js specific issues.
-   **Imports:** Group imports in this order:
    1.  React / Next.js
    2.  Third-party libraries
    3.  Internal Components (`@/components/...`)
    4.  Hooks / Utils (`@/hooks/...`, `@/lib/...`)
        5. Styles (`./Component.module.scss`)
    
    ---
    
    ## 8. Commit Standards (Conventional Commits)
    
    We follow the **Conventional Commits** specification to ensure a clean, readable history that enables automated changelogs.
    
    ### 8.1. Structure
    ```
    <type>(<scope>): <short description>
    
    [optional body explaining "why" - not "what"]
    ```
    
    ### 8.2. Types
    -   `feat`: A new feature (e.g., "Add Quest Log window").
    -   `fix`: A bug fix (e.g., "Fix broken link in Navbar").
    -   `docs`: Documentation only changes.
    -   `style`: Formatting, missing semi-colons, etc. (no code change).
    -   `refactor`: A code change that neither fixes a bug nor adds a feature.
    -   `test`: Adding missing tests or correcting existing tests.
    -   `chore`: Build process, dependency updates, auxiliary tools.
    
    ### 8.3. Examples
    -   `feat(desktop): add drag-and-drop functionality to icons`
    -   `fix(journal): resolve hydration error on date parsing`
    -   `chore(deps): upgrade next.js to v16.1`
    
    ### 8.4. When to Commit
    -   **Atomic Changes:** Commit as soon as you have completed a single logical unit of work (e.g., "Created the Button component" or "Fixed the login bug"). Do not mix unrelated changes (e.g., "Fixed login bug AND updated the footer").
    -   **Passing Tests:** Never commit code that breaks the build or fails tests. Run `pnpm lint` and `pnpm test` (if applicable) before committing.
    -   **End of Session:** Always commit your work before ending a coding session, even if it's a "WIP" (Work In Progress), so you can pick up exactly where you left off.
    -   **Before Refactoring:** Commit your working state before starting a risky refactor.
    
    ---
    
    ## 9. Code Readability & Maintainability    
    Code is read much more often than it is written. We optimize for the human reader (you), not just the machine.
    
    ### 9.1. Self-Documenting Code
    -   **Variable Names:** Must be descriptive. `isOpen` is better than `flag`. `fetchUserProfile` is better than `getData`.
    -   **Magic Numbers:** Avoid them. Extract specific values to constants.
        -   ❌ `if (xp > 1000) ...`
        -   ✅ `const MAX_LEVEL_XP = 1000; if (xp > MAX_LEVEL_XP) ...`
    
    ### 9.2. Comments
    -   **The "Why", Not the "What":** Do not comment on what the code does (the code itself should explain that). Comment on *why* a specific, complex approach was taken.
    -   **Complex Logic:** If a function has complex logic (e.g., the XP calculation formula), provide a brief comment block above it explaining the math/algorithm.
    
    ### 9.3. KISS (Keep It Simple, Stupid)
    -   Avoid over-engineering. If a simple `if/else` works, don't build a Factory Pattern unless extensibility is an immediate requirement.
    -   **Refactor Early:** If a component exceeds 200 lines, consider breaking it down into smaller sub-components.
    

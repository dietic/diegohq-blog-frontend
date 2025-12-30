# Technical Standards & Coding Guidelines

This document serves as the "source of truth" for all development on the **DiegoHQ Blog Frontend**. All AI agents and developers must adhere to these standards to ensure consistency, maintainability, and performance.

---

## 1. Tech Stack & Versioning

- **Frontend:** Next.js 16+ (App Router).
- **Content CMS:** Custom CMS (Git-based MDX files with Zod schemas). See `planning/CUSTOM_CMS.md`.
- **Game Backend:** Python FastAPI (External API - handles auth, XP, quests, items).
- **Language:** TypeScript (Strict Mode).
- **Library:** React 19+ (Functional Components only).
- **Window Management:** `react-rnd`.
- **MDX Processing:** `next-mdx-remote` + `gray-matter`.
- **Schema Validation:** Zod.
- **Styling:** Plain SCSS (No CSS Modules, No Tailwind). Global scope with BEM naming convention recommended.
- **Testing:** Vitest (Unit) + Storybook (Component Isolation).
- **Package Manager:** `pnpm`.

---

## 2. Component Architecture

### 2.1. File Structure (Co-location)

All components must be self-contained in their own directory within `src/components/`.

```
src/components/
└── Window/
    ├── Window.tsx          # Component Logic
    ├── Window.scss         # Component Styling (Global Standard)
    ├── Window.stories.tsx  # Storybook Documentation
    └── Window.test.tsx     # Vitest Unit Tests
```

### 2.2. Component Syntax

- **Pattern:** Use **Arrow Functions** for all components.
- **Exports:** Use **Named Exports** (avoid `default` exports to make refactoring easier).
- **Props:** explicitly typed with an `interface` named `[ComponentName]Props`.

```tsx
// ✅ GOOD
import './Window.scss';

interface WindowProps {
  title: string;
  isOpen: boolean;
}

export const Window = ({ title, isOpen }: WindowProps) => {
  return (
    <div className="diegohq-window">
      <h2 className="diegohq-window__title">{title}</h2>
    </div>
  );
};
```

```tsx
// ❌ BAD
export default function Window(props: any) { ... } // No default export, no 'any'
```

### 2.3. Server vs. Client Components

- **Default:** All components are **Server Components** by default.
- **Client:** Only add `'use client'` at the top of the file if the component uses:
  - Event listeners (`onClick`, `onChange`).
  - React Hooks (`useState`, `useEffect`).
  - Browser-only APIs (`window`, `localStorage`).

---

## 3. Styling Strategy: Plain SCSS & Pixel Art

Since we are building a Retro OS, precise control over CSS is required.

- **Palette Preservation:** The project's color palette is preserved in `src/styles/_variables.scss` (migrated from Tailwind). All components must reference these SCSS variables.
- **Methodology:** Use **Plain SCSS** without modules. Styles are global.
  - **Organization:** Co-locate SCSS files with components (e.g., `Window.scss`) but do NOT use `.module.scss`. Import these into a global entry point or the component file if using a bundler that supports side-effect imports (Next.js supports this).
  - **Naming:** Use **BEM (Block Element Modifier)** or a strict namespacing prefix (e.g., `.diegohq-window`) to avoid collisions in the global scope.
- **Strict Prohibition:** Do NOT use Tailwind CSS. Do NOT use CSS Modules.
- **Pixel Art Specifics:**
  - Images/Icons must use: `image-rendering: pixelated;`.
  - Fonts must be imported via `next/font` and applied via global classes or mixins.

---

## 4. TypeScript Rules

- **Strict Mode:** Enabled.
- **Explicit Types:** Return types for complex functions should be explicit.
- **No `any`:** usage of `any` is strictly prohibited. Use `unknown` or define a generic if the type is truly dynamic.
- **Interfaces:** Prefer `interface` over `type` for public props and object definitions (better error messages and extensibility).

---

## 5. State Management

- **Local State:** `useState` / `useReducer` for component-level logic.
- **Auth & User Data:** JWT Token (from Backend). User profile (`xp`, `level`) is fetched from `/api/v1/users/me`.
- **Global State:** React Context API (e.g., `WindowContext`, `ThemeContext`).
- **URL State:** For shareable state (e.g., active tab, selected post), prefer storing state in the URL Search Params (`useSearchParams`).

---

## 6. Testing Guidelines

- **Unit Tests (Vitest):** Test logic, utility functions, and hooks.
- **Component Tests (Storybook/Vitest):**
  - Every UI component **MUST** have a corresponding `.stories.tsx` file.
  - Stories should cover the "Happy Path" and "Edge Cases" (e.g., Loading, Empty, Error).

---

## 7. Formatting & Quality

- **Prettier:** Run `pnpm format` before committing.
- **Linting:** Run `pnpm lint` to catch Next.js specific issues.
- **Imports:** Group imports in this order:
  1.  React / Next.js
  2.  Third-party libraries
  3.  Internal Components (`@/components/...`)
  4.  Hooks / Utils (`@/hooks/...`, `@/lib/...`)
  5.  Styles (`./Component.scss`)

  ***

  ## 8. Commit Standards (Conventional Commits)

  We follow the **Conventional Commits** specification to ensure a clean, readable history that enables automated changelogs.

  ### 8.1. Structure

  ```
  <type>(<scope>): <short description>

  [optional body explaining "why" - not "what"]
  ```

  ### 8.2. Types
  - `feat`: A new feature (e.g., "Add Quest Log window").
  - `fix`: A bug fix (e.g., "Fix broken link in Navbar").
  - `docs`: Documentation only changes.
  - `style`: Formatting, missing semi-colons, etc. (no code change).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Build process, dependency updates, auxiliary tools.

  ### 8.3. Examples
  - `feat(desktop): add drag-and-drop functionality to icons`
  - `fix(journal): resolve hydration error on date parsing`
  - `chore(deps): upgrade next.js to v16.1`

  ### 8.4. When to Commit
  - **Atomic Changes:** Commit as soon as you have completed a single logical unit of work (e.g., "Created the Button component" or "Fixed the login bug"). Do not mix unrelated changes (e.g., "Fixed login bug AND updated the footer").
  - **Passing Tests:** Never commit code that breaks the build or fails tests. Run `pnpm lint` and `pnpm test` (if applicable) before committing.
  - **End of Session:** Always commit your work before ending a coding session, even if it's a "WIP" (Work In Progress), so you can pick up exactly where you left off.
  - **Before Refactoring:** Commit your working state before starting a risky refactor.

  ***

  ## 9. Code Readability & Maintainability

  Code is read much more often than it is written. We optimize for the human reader (you), not just the machine.

  ### 9.1. Self-Documenting Code
  - **Variable Names:** Must be descriptive. `isOpen` is better than `flag`. `fetchUserProfile` is better than `getData`.
  - **Magic Numbers:** Avoid them. Extract specific values to constants.
    - ❌ `if (xp > 1000) ...`
    - ✅ `const MAX_LEVEL_XP = 1000; if (xp > MAX_LEVEL_XP) ...`

  ### 9.2. Comments
  - **The "Why", Not the "What":** Do not comment on what the code does (the code itself should explain that). Comment on _why_ a specific, complex approach was taken.
  - **Complex Logic:** If a function has complex logic (e.g., the XP calculation formula), provide a brief comment block above it explaining the math/algorithm.

### 9.3. KISS (Keep It Simple, Stupid)

- Avoid over-engineering. If a simple `if/else` works, don't build a Factory Pattern unless extensibility is an immediate requirement.
- **Refactor Early:** If a component exceeds 200 lines, consider breaking it down into smaller sub-components.

---

## 10. SEO & Discoverability

Search engine optimization is critical for blog content visibility.

### 10.1. Metadata Standards

- **Page Titles:** Every page must have a unique, descriptive `<title>` tag (50-60 characters max).
- **Meta Descriptions:** Every page must have a `<meta name="description">` tag (150-160 characters max).
- **Next.js Metadata API:** Use the `metadata` export in `layout.tsx` or `page.tsx` for static metadata, and `generateMetadata` for dynamic pages.

```tsx
// Static metadata example
export const metadata: Metadata = {
  title: "The Adventurer's Journal | Diego HQ",
  description:
    'A gamified programming blog with quests, XP, and pixel-art aesthetics.',
};

// Dynamic metadata for posts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: `${post.title} | The Adventurer's Journal`,
    description: post.excerpt,
  };
}
```

### 10.2. OpenGraph & Social Sharing

- **Required OG Tags:** `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **Twitter Cards:** Include `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- **OG Images:** Create pixel-art styled OG images (1200x630px recommended). Consider using `next/og` for dynamic image generation.

### 10.3. Structured Data (JSON-LD)

- **Blog Posts:** Use `Article` schema for journal entries.
- **Author:** Use `Person` schema for the blog author.
- **Website:** Use `WebSite` schema with `SearchAction` for the main site.

```tsx
// Example JSON-LD for a blog post
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  author: { '@type': 'Person', name: 'Diego' },
  datePublished: post.date,
};
```

### 10.4. Analytics & Tracking

- **Tool:** Use privacy-friendly analytics (e.g., **Plausible**, **Umami**, or **Vercel Analytics**).
- **Events to Track:**
  - Page views
  - Quest completions
  - Level-up events
  - Window interactions (optional, for UX insights)
- **Implementation:** Load analytics scripts via `next/script` with `strategy="afterInteractive"`.

### 10.5. Technical SEO

- **Sitemap:** Auto-generate via `next-sitemap` or Next.js built-in sitemap generation.
- **Robots.txt:** Ensure crawlers can access public content; block admin routes (`/admin`, `/api/*`).
- **Canonical URLs:** Set canonical URLs for all pages to prevent duplicate content issues.
- **Semantic HTML:** Use proper heading hierarchy (`h1` > `h2` > `h3`), `<article>`, `<nav>`, `<main>` tags.

---

## 11. Security

Security is non-negotiable, especially with user authentication and game data.

### 11.1. Authentication & JWT Handling

- **Storage:** Store JWT tokens in **HTTP-only cookies** (preferred) or in-memory. **Never** store tokens in `localStorage` or `sessionStorage`.
- **Token Refresh:** Implement token refresh logic to handle expiry gracefully without forcing re-login.
- **Logout:** On logout, clear tokens and invalidate the session on the backend.

### 11.2. Input Validation & Sanitization

- **User Inputs:** All user inputs (quest answers, profile names) must be validated on both client and server.
- **XSS Prevention:** Never use `dangerouslySetInnerHTML` without sanitizing content first. Use libraries like `DOMPurify` for Markdown/HTML content.
- **SQL Injection:** Handled by the Python backend, but ensure no raw queries are ever constructed from user input.

### 11.3. CORS & CSP Policies

- **CORS:** The Python FastAPI backend should only allow requests from the frontend domain(s).
- **Content Security Policy (CSP):** Define strict CSP headers to prevent XSS attacks:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
  ```
- **Implementation:** Configure CSP via Next.js `next.config.ts` headers or middleware.

### 11.4. Rate Limiting & Abuse Prevention

- **API Calls:** The Python backend should implement rate limiting (e.g., 100 requests/minute per user).
- **Game Actions:** Limit XP-earning actions (e.g., one "read post" XP reward per post per user).

### 11.5. Dependency Security

- **Audit:** Run `pnpm audit` regularly to check for vulnerabilities.
- **Updates:** Keep dependencies up to date, especially security-critical packages.

---

## 12. Performance Budgets

A performant site is crucial for user experience and SEO.

### 12.1. Core Web Vitals Targets

| Metric                                | Target  | Description                        |
| ------------------------------------- | ------- | ---------------------------------- |
| **LCP** (Largest Contentful Paint)    | < 2.5s  | Main content loads quickly         |
| **FID** (First Input Delay) / **INP** | < 100ms | Page responds to interactions fast |
| **CLS** (Cumulative Layout Shift)     | < 0.1   | No unexpected layout jumps         |

### 12.2. Bundle Size Limits

- **JavaScript:** Total JS bundle should not exceed **200KB** (gzipped) for initial load.
- **CSS:** Total CSS should not exceed **50KB** (gzipped).
- **Analysis:** Run `pnpm build` and check the output. Use `@next/bundle-analyzer` for detailed reports.

### 12.3. Lazy Loading Strategy

- **Windows:** Load window content lazily when opened (use `React.lazy` or dynamic imports).
- **Images:** Use `next/image` with `loading="lazy"` for all images.
- **Heavy Components:** Code-split large components (e.g., Terminal, Quest Log) using `next/dynamic`.

```tsx
import dynamic from 'next/dynamic';

const QuestLog = dynamic(() => import('@/components/QuestLog'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // If it uses browser APIs
});
```

### 12.4. Image Optimization

- **Format:** Use WebP or AVIF for non-pixel-art images; PNG for pixel art (to preserve crispness).
- **Sizing:** Always specify `width` and `height` attributes to prevent CLS.
- **Pixel Art:** Apply `image-rendering: pixelated;` CSS and avoid upscaling beyond 2x-4x original size.

### 12.5. Caching Strategy

- **Static Assets:** Leverage Next.js automatic caching for static files.
- **API Responses:** Cache user profile data with SWR/React Query (stale-while-revalidate pattern).
- **CDN:** Ensure the hosting provider (Vercel, etc.) uses edge caching for static content.

---

## 13. Error Handling & Resilience

Graceful error handling improves user experience and debuggability.

### 13.1. API Error Handling

- **Try-Catch:** Wrap all API calls in try-catch blocks.
- **Error Boundaries:** Use React Error Boundaries to catch rendering errors and display fallback UI.
- **User Feedback:** Show user-friendly error messages (e.g., "Failed to load quests. Please try again."). Never expose raw error messages or stack traces.

```tsx
// API call pattern
try {
  const data = await fetchUserProfile();
  return data;
} catch (error) {
  console.error('Failed to fetch profile:', error);
  throw new Error('Unable to load your profile. Please try again later.');
}
```

### 13.2. Loading States

- **Skeleton Loaders:** Show pixel-art styled skeleton loaders while content loads.
- **Suspense:** Use React Suspense with fallback components for lazy-loaded content.

### 13.3. Offline Considerations

- **Graceful Degradation:** If the API is unavailable, show cached content where possible (e.g., last-known XP/level from localStorage as fallback display).
- **Connection Detection:** Optionally show an "Offline" indicator in the Taskbar if the user loses connection.
- **PWA (Future):** Consider adding a service worker for offline reading of previously viewed posts.

### 13.4. Logging & Monitoring

- **Client Errors:** Consider integrating an error tracking service (e.g., Sentry) for production.
- **Structured Logs:** Log errors with context (user action, component, timestamp) for easier debugging.

---

## 14. Changelog Generation

Automated changelogs from conventional commits keep users and contributors informed.

### 14.1. Tooling

- **Package:** Use `standard-version` or `@changesets/cli` for automated changelog generation.
- **Alternative:** Use `conventional-changelog-cli` for simpler setups.

### 14.2. Setup (standard-version)

```bash
pnpm add -D standard-version
```

Add to `package.json`:

```json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  }
}
```

### 14.3. Workflow

1.  Commit all changes using conventional commit format.
2.  Run `pnpm release` to:
    - Bump version in `package.json`
    - Generate/update `CHANGELOG.md`
    - Create a git tag
3.  Push changes and tags: `git push --follow-tags origin main`

### 14.4. Changelog Format

The generated changelog groups commits by type:

```markdown
# Changelog

## [1.2.0] - 2025-12-15

### Features

- **desktop:** add drag-and-drop functionality to icons

### Bug Fixes

- **journal:** resolve hydration error on date parsing

### Chores

- **deps:** upgrade next.js to v16.1
```

---

## 15. Legal & Privacy

Compliance with privacy regulations is mandatory.

### 15.1. Privacy Policy

- **Requirement:** A Privacy Policy page (`/privacy`) must exist before launch.
- **Content:** Must disclose:
  - What data is collected (game progress, analytics)
  - How data is stored (localStorage, backend database)
  - Third-party services used (analytics, auth providers)
  - User rights (data deletion, export)

### 15.2. Cookie & Storage Consent

- **localStorage Usage:** Since game progress is stored in localStorage (MVP), inform users on first visit.
- **Analytics Cookies:** If using analytics that set cookies, implement a cookie consent banner.
- **Implementation:** Use a simple consent modal that stores the user's preference.

### 15.3. Terms of Service

- **Requirement:** A Terms of Service page (`/terms`) should exist.
- **Content:** Cover acceptable use, intellectual property, disclaimers, and limitation of liability.

### 15.4. GDPR & Data Rights (Future)

- **Data Export:** Provide a way for users to export their game data (JSON download).
- **Data Deletion:** Provide a way for users to delete their account and all associated data.
- **Right to Access:** Users can request what data is stored about them.

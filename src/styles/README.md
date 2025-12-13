# SCSS Architecture

This directory contains global SCSS utilities and helpers.

## Files

### `_variables.scss`
Contains SCSS variables for:
- Responsive breakpoints
- Font stack definitions
- Z-index layers

**Usage:**
```scss
@use '@/styles/variables' as *;

.my-component {
  font-family: $font-vt323;
  z-index: $z-window;
}
```

### `_mixins.scss`
Contains reusable SCSS mixins for:
- Responsive media queries (`@include mobile`, `@include desktop`)
- Flexbox utilities (`@include flex-center`)
- Pixel-art rendering (`@include pixel-art`)
- Animations and transitions

**Usage:**
```scss
@use '@/styles/mixins' as *;

.my-component {
  @include flex-center;
  
  @include desktop {
    font-size: 1.5rem;
  }
}
```

### `_reset.scss`
Modern CSS reset for consistent cross-browser styling. This is automatically applied globally via `globals.css`.

## Design Tokens (CSS Variables)

Color and spacing tokens are defined in `src/app/theme.css` and imported in `globals.css`. Access them directly in your SCSS:

```scss
.my-component {
  background: var(--window-primary-bg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

## Component Styling

All component styles should:
1. Use **plain `.scss` files** (NOT `.module.scss`)
2. Follow **BEM naming convention** (e.g., `.hq-navbar__section--left`)
3. Be co-located with the component (e.g., `Navbar.tsx` + `Navbar.scss`)
4. Import SCSS utilities as needed: `@use '@/styles/mixins' as *;`

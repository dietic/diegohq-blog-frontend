# Theming and Aesthetics Guide

This guide defines the visual and audio identity of "The Adventurer's Journal."

## 1. Visual Style: "Soft Pixel Art"

The primary aesthetic is inspired by Game Boy Advance (GBA) and SNES RPGs, but with a softer, more modern touch.

-   **Color Palette:**
    -   Avoid harsh, pure-black outlines. Opt for dark, saturated colors for borders (e.g., dark purple, deep blue, dark brown).
    -   The palette should be slightly desaturated and favor earthy or pastel tones over vibrant neon colors.
    -   Key Colors (Preserved in `src/app/theme.css`):
        -   **Button Primary:** `oklch(0.9021 0.134 165.84)`
        -   **Button Border:** `oklch(0.7066 0.1637 158.07)`
        -   **Window Background:** `oklch(0.9861 0.0017 325.59)`
        -   **Window Border:** `oklch(0.2768 0 0)`
        -   **Window Header:** `oklch(0.3739 0.0599 264.04)`
        -   **Window Action BG:** `oklch(0.5252 0.0599 264.04)`
-   **Pixel Art Rules:**
    -   Maintain a consistent pixel density. All assets should look like they belong in the same "game."
    -   UI elements (buttons, icons, window frames) should be chunky and clear.
    -   Icons should be easily recognizable at small sizes (e.g., 32x32 or 48x48 pixels).

-   **Font:**
    -   A primary pixel font must be chosen. It needs to be highly readable for long-form blog content.
    -   Recommended to find a font that supports common weights (regular, bold) and special characters.
    -   Examples: "Silkscreen," "Press Start 2P," or a custom-made font.

## 2. Interface & Layout

-   **Desktop Background:** A simple, non-distracting pixel art background. Could be a subtle pattern or a landscape that changes based on the time of day.
-   **Icons:** Themed around a fantasy/adventure setting.
    -   `My Profile`: A person/hero icon.
    -   `Journal`: A book or scroll icon.
    -   `Quests`: A map or compass icon.
    -   `Inventory`: A treasure chest or backpack icon.
-   **Windows (Desktop Mode):**
    -   Classic OS design: Title bar with minimize, maximize, and close buttons.
    -   A subtle drop shadow to give depth.
    -   Status bar at the bottom for extra info if needed.
-   **Mobile "Handheld" Mode (Dual Interface):**
    -   **Concept:** Instead of shrinking the desktop, the UI transforms into a "Handheld Console" or Pokedex interface.
    -   **Navigation:** Draggable windows are replaced by full-screen "Apps" with a bottom tab bar or "Start Menu" drawer.
    -   **Touch Targets:** Buttons and icons are enlarged for touch friendliness (minimum 44x44px).
    -   **Layout:** Single-column layout for reading posts, optimized for vertical scrolling.

## 3. Audio Design

Audio is crucial for immersion but should not be intrusive.

-   **Background Music (BGM):**
    -   A single, long, looping track.
    -   Style: Lo-fi chiptune, calm and atmospheric. It should aid concentration, not distract.
    -   The music should be quiet by default.
-   **Sound Effects (SFX):**
    -   **Style:** Soft, 8-bit/16-bit sounds. Avoid sharp, jarring noises.
    -   **Key Sounds:**
        -   Open/Close Window: A soft "swoosh" or "click."
        -   Button Click: A gentle "boop."
        -   Quest Complete: A positive, short fanfare (e.g., Zelda "item get" sound).
        -   Level Up: A more significant, celebratory sound effect.
        -   Receive Item: A magical "shimmer" sound.
        -   Error: A muted, low-pitched "buzz" or "thud."
-   **Audio Controls:**
    -   A master volume control or separate toggles for BGM and SFX must be easily accessible at all times.

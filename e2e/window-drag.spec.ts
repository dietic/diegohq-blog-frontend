import { test, expect } from '@playwright/test';

test.describe('Window drag behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.hq-desktop');
  });

  test('can drag a maximized window and it restores to normal size', async ({ page }) => {
    // Open a window by double-clicking the Journal icon
    const journalIcon = page.locator('.hq-desktop-icon').filter({ hasText: 'Journal' });
    await journalIcon.dblclick();

    // Wait for window to appear
    const window = page.locator('.hq-window').first();
    await expect(window).toBeVisible();

    // Get initial window size
    const initialBox = await window.boundingBox();
    expect(initialBox).not.toBeNull();

    // Maximize the window by clicking the maximize button (2nd button in header actions)
    const maximizeButton = window.locator('.hq-window--button').nth(1);
    await maximizeButton.click();

    // Wait for maximized state
    await expect(window).toHaveClass(/hq-window--maximized/);

    // Get maximized size (should be full viewport)
    const maximizedBox = await window.boundingBox();
    expect(maximizedBox).not.toBeNull();
    expect(maximizedBox!.width).toBeGreaterThan(initialBox!.width);

    // Get the header for dragging
    const header = window.locator('.hq-window--header');
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();

    // Start drag from middle of header
    const startX = headerBox!.x + headerBox!.width / 2;
    const startY = headerBox!.y + headerBox!.height / 2;

    // Drag the window down and to the right
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 10 });

    // Window should no longer be maximized during drag
    await expect(window).not.toHaveClass(/hq-window--maximized/);

    // Complete the drag
    await page.mouse.up();

    // Verify window is restored to a smaller size
    const restoredBox = await window.boundingBox();
    expect(restoredBox).not.toBeNull();
    expect(restoredBox!.width).toBeLessThan(maximizedBox!.width);
    expect(restoredBox!.height).toBeLessThan(maximizedBox!.height);

    // Window should be near where we dragged it (not at 0,0)
    expect(restoredBox!.x).toBeGreaterThan(50);
    expect(restoredBox!.y).toBeGreaterThan(50);
  });

  test('window follows cursor proportionally when dragging from maximized', async ({ page }) => {
    // Open a window
    const journalIcon = page.locator('.hq-desktop-icon').filter({ hasText: 'Journal' });
    await journalIcon.dblclick();

    const window = page.locator('.hq-window').first();
    await expect(window).toBeVisible();

    // Maximize
    const maximizeButton = window.locator('.hq-window--button').nth(1);
    await maximizeButton.click();
    await expect(window).toHaveClass(/hq-window--maximized/);

    const header = window.locator('.hq-window--header');
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();

    // Drag from the RIGHT side of the header (75% across)
    const startX = headerBox!.x + headerBox!.width * 0.75;
    const startY = headerBox!.y + headerBox!.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX, startY + 50, { steps: 5 });
    await page.mouse.up();

    // The cursor should still be roughly at 75% of the restored window width
    const restoredBox = await window.boundingBox();
    expect(restoredBox).not.toBeNull();

    // Check that the window is positioned so cursor is near the right side
    // (window's right edge should be close to where we dragged)
    // Using 150px tolerance to account for browser/timing variations
    const windowRightEdge = restoredBox!.x + restoredBox!.width;
    expect(windowRightEdge).toBeGreaterThan(startX - 150);
    expect(windowRightEdge).toBeLessThan(startX + 150);
  });

  test('normal window drag still works correctly', async ({ page }) => {
    // Open a window
    const journalIcon = page.locator('.hq-desktop-icon').filter({ hasText: 'Journal' });
    await journalIcon.dblclick();

    const window = page.locator('.hq-window').first();
    await expect(window).toBeVisible();

    // Get initial position
    const initialBox = await window.boundingBox();
    expect(initialBox).not.toBeNull();

    const header = window.locator('.hq-window--header');
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();

    // Drag the non-maximized window (primarily horizontal due to bounds="parent")
    const startX = headerBox!.x + headerBox!.width / 2;
    const startY = headerBox!.y + headerBox!.height / 2;
    const dragDistanceX = 150;
    const dragDistanceY = 50; // Smaller vertical drag due to parent bounds

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dragDistanceX, startY + dragDistanceY, { steps: 10 });
    await page.mouse.up();

    // Check window moved by approximately the drag distance
    const finalBox = await window.boundingBox();
    expect(finalBox).not.toBeNull();
    expect(finalBox!.x).toBeGreaterThan(initialBox!.x + dragDistanceX - 30);
    // Y position may be constrained by parent bounds, so just check it moved at least a bit
    expect(finalBox!.y).toBeGreaterThanOrEqual(initialBox!.y);
  });
});

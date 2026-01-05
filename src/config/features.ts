/**
 * Feature flags configuration.
 *
 * Controls which features are enabled/disabled in the application.
 * Set via environment variables for easy toggling between environments.
 */

export const features = {
  /**
   * Items/Inventory feature.
   * When disabled:
   * - Inventory window is hidden from desktop
   * - Item admin pages are hidden
   * - item_reward fields are hidden in quest forms
   * - required_item fields are hidden in post forms
   */
  itemsEnabled: process.env.NEXT_PUBLIC_FEATURE_ITEMS_ENABLED === 'true',
} as const;

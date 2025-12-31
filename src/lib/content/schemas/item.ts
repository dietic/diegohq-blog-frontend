import { z } from 'zod';

export const ItemRaritySchema = z.enum([
  'common',
  'uncommon',
  'rare',
  'legendary',
]);

export const ItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(50),
  description: z.string().max(200),

  // Display
  icon: z.string(),
  rarity: ItemRaritySchema.default('common'),

  // Flavor
  flavorText: z.string().max(150).optional(),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemRarity = z.infer<typeof ItemRaritySchema>;

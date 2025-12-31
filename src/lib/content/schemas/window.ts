import { z } from 'zod';

export const WindowContentFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(50),

  // Optional icon for the window header
  icon: z.string().optional(),

  // Default window dimensions
  defaultWidth: z.number().int().min(200).default(600),
  defaultHeight: z.number().int().min(150).default(400),

  // Behavior
  singleton: z.boolean().default(true),
  closable: z.boolean().default(true),
  minimizable: z.boolean().default(true),
  maximizable: z.boolean().default(true),

  // Gating
  requiredLevel: z.number().int().min(1).optional(),
  requiredItem: z.string().optional(),
});

export type WindowContentFrontmatter = z.infer<
  typeof WindowContentFrontmatterSchema
>;

export interface WindowContent extends WindowContentFrontmatter {
  content: string;
}

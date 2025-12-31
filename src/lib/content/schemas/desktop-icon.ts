import { z } from 'zod';

export const WindowTypeSchema = z.enum([
  'journal',
  'quest-log',
  'inventory',
  'profile',
  'settings',
  'custom',
  'external',
]);

export const WindowConfigSchema = z.object({
  title: z.string().optional(),
  defaultWidth: z.number().int().min(200).default(600),
  defaultHeight: z.number().int().min(150).default(400),
  minWidth: z.number().int().min(100).optional(),
  minHeight: z.number().int().min(100).optional(),
  resizable: z.boolean().default(true),
  maximizable: z.boolean().default(true),
});

export const DesktopIconSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1).max(20),
  icon: z.string(),

  // Position on desktop (grid-based)
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
  }),

  // What happens when double-clicked
  windowType: WindowTypeSchema,
  windowId: z.string().optional(),
  externalUrl: z.string().url().optional(),

  // Window configuration
  windowConfig: WindowConfigSchema.optional(),

  // Visibility/Gating
  requiredLevel: z.number().int().min(1).optional(),
  requiredItem: z.string().optional(),
  visible: z.boolean().default(true),

  // Ordering
  order: z.number().int().default(0),
});

export const DesktopSettingsSchema = z.object({
  gridSize: z.number().int().default(80),
  iconSpacing: z.number().int().default(16),
  startPosition: z
    .object({
      x: z.number().int().default(20),
      y: z.number().int().default(20),
    })
    .optional(),
});

export const DesktopIconsFileSchema = z.object({
  icons: z.array(DesktopIconSchema),
  settings: DesktopSettingsSchema.optional(),
});

export type DesktopIcon = z.infer<typeof DesktopIconSchema>;
export type DesktopIconsFile = z.infer<typeof DesktopIconsFileSchema>;
export type DesktopSettings = z.infer<typeof DesktopSettingsSchema>;
export type WindowType = z.infer<typeof WindowTypeSchema>;
export type WindowConfig = z.infer<typeof WindowConfigSchema>;

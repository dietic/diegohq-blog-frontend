// Post schemas
export {
  PostFrontmatterSchema,
  ContentPillarSchema,
  TargetLevelSchema,
} from './post';
export type { Post, PostFrontmatter, ContentPillar, TargetLevel } from './post';

// Quest schemas
export { QuestSchema, QuestTypeSchema, QuestDifficultySchema } from './quest';
export type { Quest, QuestType, QuestDifficulty } from './quest';

// Item schemas
export { ItemSchema, ItemRaritySchema } from './item';
export type { Item, ItemRarity } from './item';

// Desktop Icon schemas
export {
  DesktopIconSchema,
  DesktopIconsFileSchema,
  DesktopSettingsSchema,
  WindowTypeSchema,
  WindowConfigSchema,
} from './desktop-icon';
export type {
  DesktopIcon,
  DesktopIconsFile,
  DesktopSettings,
  WindowType,
  WindowConfig,
} from './desktop-icon';

// Window Content schemas
export { WindowContentFrontmatterSchema } from './window';
export type { WindowContent, WindowContentFrontmatter } from './window';

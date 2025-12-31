/**
 * Custom CMS for The Adventurer's Journal
 *
 * Git-based content management system using MDX for posts and JSON for structured data.
 * All content is stored in the /content directory and validated using Zod schemas.
 */

// ============================================================================
// SCHEMAS - Zod schemas for content validation
// ============================================================================

export {
  // Post schemas
  PostFrontmatterSchema,
  ContentPillarSchema,
  TargetLevelSchema,
  // Quest schemas
  QuestSchema,
  QuestTypeSchema,
  QuestDifficultySchema,
  // Item schemas
  ItemSchema,
  ItemRaritySchema,
  // Desktop Icon schemas
  DesktopIconSchema,
  DesktopIconsFileSchema,
  DesktopSettingsSchema,
  WindowTypeSchema,
  WindowConfigSchema,
  // Window Content schemas
  WindowContentFrontmatterSchema,
} from './schemas';

export type {
  // Post types
  Post,
  PostFrontmatter,
  ContentPillar,
  TargetLevel,
  // Quest types
  Quest,
  QuestType,
  QuestDifficulty,
  // Item types
  Item,
  ItemRarity,
  // Desktop types
  DesktopIcon,
  DesktopIconsFile,
  DesktopSettings,
  WindowType,
  WindowConfig,
  // Window types
  WindowContent,
  WindowContentFrontmatter,
} from './schemas';

// ============================================================================
// API - Read-only functions for fetching content
// ============================================================================

export {
  // Posts
  getAllPosts,
  getPublishedPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByContentPillar,
  getPostsByTag,
  getAccessiblePosts,
  getRelatedPosts,
  // Quests
  getAllQuests,
  getQuestById,
  getQuestsByPostSlug,
  getQuestsWithItemReward,
  // Items
  getAllItems,
  getItemById,
  getItemsByRarity,
  // Desktop
  getDesktopIconsFile,
  getDesktopIcons,
  getVisibleDesktopIcons,
  getAccessibleDesktopIcons,
  getDesktopIconById,
  getDesktopSettings,
  getWindowContent,
  getAllWindowContents,
} from './api';

export type { PostListItem } from './api';

// ============================================================================
// ACTIONS - Server Actions for CRUD operations
// ============================================================================

export {
  // Posts
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  // Quests
  createQuest,
  updateQuest,
  deleteQuest,
  // Items
  createItem,
  updateItem,
  deleteItem,
  // Desktop
  updateDesktopIcons,
  addDesktopIcon,
  updateDesktopIcon,
  deleteDesktopIcon,
  reorderDesktopIcons,
  createWindowContent,
  updateWindowContent,
  deleteWindowContent,
} from './actions';

export type {
  CreatePostInput,
  UpdatePostInput,
  CreateWindowInput,
  ActionResult,
} from './actions';

// ============================================================================
// UTILITIES - Helper functions for content processing
// ============================================================================

export {
  // Reading time
  calculateReadingTime,
  getReadingTimeMinutes,
  // MDX parsing
  parseMdx,
  serializeMdx,
  // File system
  getContentPath,
  readFile,
  writeFile,
  deleteFile,
  fileExists,
  listFiles,
  readJsonFile,
  writeJsonFile,
} from './utils';

export type { ReadingTimeResult, ParsedMdx } from './utils';

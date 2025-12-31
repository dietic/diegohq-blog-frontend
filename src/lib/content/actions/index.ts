// Post Actions
export {
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from './posts';
export type { CreatePostInput, UpdatePostInput } from './posts';

// Quest Actions
export { createQuest, updateQuest, deleteQuest } from './quests';

// Item Actions
export { createItem, updateItem, deleteItem } from './items';

// Desktop Actions
export {
  updateDesktopIcons,
  addDesktopIcon,
  updateDesktopIcon,
  deleteDesktopIcon,
  reorderDesktopIcons,
  createWindowContent,
  updateWindowContent,
  deleteWindowContent,
} from './desktop';
export type { CreateWindowInput } from './desktop';

// Common types
export type { ActionResult } from './posts';

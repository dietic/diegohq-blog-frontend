/**
 * API response types matching backend schemas
 */

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

// Content types
export type ContentPillar = 'programming' | 'growth-career' | 'saas-journey';
export type TargetLevel = 'beginner' | 'intermediate' | 'advanced';
export type QuestType = 'multiple-choice' | 'text-input' | 'call-to-action';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type WindowType = 'custom' | 'external';

// Post types
export interface PostCreate {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  content_pillar: ContentPillar;
  target_level: TargetLevel;
  author?: string;
  tags?: string[] | null;
  required_level?: number | null;
  required_item?: string | null;
  challenge_text?: string | null;
  read_xp?: number;
  quest_id?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  icon?: string | null;
  published?: boolean;
  featured?: boolean;
}

export interface PostUpdate {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  content_pillar?: ContentPillar;
  target_level?: TargetLevel;
  author?: string;
  tags?: string[];
  required_level?: number | null;
  required_item?: string | null;
  challenge_text?: string | null;
  read_xp?: number;
  quest_id?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  icon?: string | null;
  published?: boolean;
  featured?: boolean;
}

export interface PostResponse {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  content_pillar: string;
  target_level: string;
  author: string;
  tags: string[] | null;
  required_level: number | null;
  required_item: string | null;
  challenge_text: string | null;
  read_xp: number;
  quest_id: string | null;
  meta_description: string | null;
  og_image: string | null;
  icon: string | null;
  published: boolean;
  featured: boolean;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface PostSummaryResponse {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_pillar: string;
  target_level: string;
  author: string;
  tags: string[] | null;
  required_level: number | null;
  required_item: string | null;
  read_xp: number;
  icon: string | null;
  published: boolean;
  featured: boolean;
  reading_time: number;
  created_at: string;
}

// Quest types
export interface QuestCreate {
  quest_id: string;
  name: string;
  description: string;
  prompt: string;
  quest_type: QuestType;
  options?: string[] | null;
  correct_answer?: string | null;
  xp_reward: number;
  item_reward?: string | null;
  host_post_slug: string;
  difficulty?: QuestDifficulty;
}

export interface QuestUpdate {
  quest_id?: string;
  name?: string;
  description?: string;
  prompt?: string;
  quest_type?: QuestType;
  options?: string[];
  correct_answer?: string;
  xp_reward?: number;
  item_reward?: string | null;
  host_post_slug?: string;
  difficulty?: QuestDifficulty;
}

export interface QuestResponse {
  id: string;
  quest_id: string;
  name: string;
  description: string;
  prompt: string;
  quest_type: string;
  options: string[] | null;
  correct_answer: string | null;
  xp_reward: number;
  item_reward: string | null;
  host_post_slug: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

// Item types
export interface ItemCreate {
  item_id: string;
  name: string;
  description: string;
  icon: string;
  rarity?: ItemRarity;
  flavor_text?: string | null;
}

export interface ItemUpdate {
  item_id?: string;
  name?: string;
  description?: string;
  icon?: string;
  rarity?: ItemRarity;
  flavor_text?: string | null;
}

export interface ItemResponse {
  id: string;
  item_id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  flavor_text: string | null;
  created_at: string;
  updated_at: string;
}

// Desktop types
export interface DesktopIconCreate {
  icon_id: string;
  label: string;
  icon: string;
  position_x: number;
  position_y: number;
  window_type: WindowType;
  window_id?: string | null;
  external_url?: string | null;
  window_config?: Record<string, unknown> | null;
  required_level?: number | null;
  required_item?: string | null;
  visible?: boolean;
  order?: number;
}

export interface DesktopIconUpdate {
  icon_id?: string;
  label?: string;
  icon?: string;
  position_x?: number;
  position_y?: number;
  window_type?: WindowType;
  window_id?: string | null;
  external_url?: string | null;
  window_config?: Record<string, unknown> | null;
  required_level?: number | null;
  required_item?: string | null;
  visible?: boolean;
  order?: number;
}

export interface DesktopIconResponse {
  id: string;
  icon_id: string;
  label: string;
  icon: string;
  position_x: number;
  position_y: number;
  window_type: string;
  window_id: string | null;
  external_url: string | null;
  window_config: Record<string, unknown> | null;
  required_level: number | null;
  required_item: string | null;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DesktopSettingsUpdate {
  grid_size?: number;
  icon_spacing?: number;
  start_position_x?: number;
  start_position_y?: number;
}

export interface DesktopSettingsResponse {
  id: string;
  key: string;
  grid_size: number;
  icon_spacing: number;
  start_position_x: number;
  start_position_y: number;
  created_at: string;
  updated_at: string;
}

export interface ReorderIconsRequest {
  icon_ids: string[];
}

// Window types
export interface WindowContentResponse {
  id: string;
  window_id: string;
  title: string;
  content: string;
  icon: string | null;
  default_width: number;
  default_height: number;
  singleton: boolean;
  closable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  required_level: number | null;
  required_item: string | null;
  created_at: string;
  updated_at: string;
}

// Contact types
export interface ContactSubmissionResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  reply_message: string | null;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmissionListResponse {
  items: ContactSubmissionResponse[];
  total: number;
  unread_count: number;
}

export interface ContactReplyRequest {
  reply_message: string;
}

// Game types
export interface ReadPostRequest {
  post_slug: string;
}

export interface ReadPostResponse {
  success: boolean;
  xpAwarded: number;
  alreadyRead: boolean;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
}

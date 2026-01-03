'use server';

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  DesktopIconResponse,
  DesktopSettingsResponse,
  PostResponse,
  PostSummaryResponse,
  QuestResponse,
  ItemResponse,
} from '@/lib/api/types';

/**
 * Public: Get visible desktop icons
 */
export async function getDesktopIcons(): Promise<DesktopIconResponse[]> {
  try {
    return await apiClient.get<DesktopIconResponse[]>(API_ENDPOINTS.content.desktopIcons);
  } catch (error) {
    console.error('Failed to fetch desktop icons:', error);
    return [];
  }
}

/**
 * Public: Get desktop settings
 */
export async function getDesktopSettings(): Promise<DesktopSettingsResponse | null> {
  try {
    return await apiClient.get<DesktopSettingsResponse>(API_ENDPOINTS.content.desktopSettings);
  } catch (error) {
    console.error('Failed to fetch desktop settings:', error);
    return null;
  }
}

/**
 * Public: Get published posts
 */
export async function getPosts(): Promise<PostSummaryResponse[]> {
  try {
    return await apiClient.get<PostSummaryResponse[]>(API_ENDPOINTS.content.posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

/**
 * Public: Get featured posts
 */
export async function getFeaturedPosts(): Promise<PostSummaryResponse[]> {
  try {
    return await apiClient.get<PostSummaryResponse[]>(API_ENDPOINTS.content.featuredPosts);
  } catch (error) {
    console.error('Failed to fetch featured posts:', error);
    return [];
  }
}

/**
 * Public: Get a published post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostResponse | null> {
  try {
    return await apiClient.get<PostResponse>(API_ENDPOINTS.content.postBySlug(slug));
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

/**
 * Public: Get all quests
 */
export async function getQuests(): Promise<QuestResponse[]> {
  try {
    return await apiClient.get<QuestResponse[]>(API_ENDPOINTS.content.quests);
  } catch (error) {
    console.error('Failed to fetch quests:', error);
    return [];
  }
}

/**
 * Public: Get all items
 */
export async function getItems(): Promise<ItemResponse[]> {
  try {
    return await apiClient.get<ItemResponse[]>(API_ENDPOINTS.content.items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return [];
  }
}

/**
 * Public: Get an item by ID
 */
export async function getItemById(itemId: string): Promise<ItemResponse | null> {
  try {
    return await apiClient.get<ItemResponse>(API_ENDPOINTS.content.itemById(itemId));
  } catch (error) {
    console.error('Failed to fetch item:', error);
    return null;
  }
}

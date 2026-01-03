'use server';

import { getAccessToken } from '@/lib/auth';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  PostCreate,
  PostUpdate,
  PostResponse,
  PostSummaryResponse,
} from '@/lib/api/types';

/**
 * Admin: Get all posts (includes unpublished)
 */
export async function getAllPosts(): Promise<PostResponse[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<PostResponse[]>(API_ENDPOINTS.admin.posts, { token });
}

/**
 * Admin: Get a post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<PostResponse>(API_ENDPOINTS.admin.postBySlug(slug), {
    token,
  });
}

/**
 * Admin: Create a new post
 */
export async function createPost(data: PostCreate): Promise<PostResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<PostResponse>(API_ENDPOINTS.admin.posts, data, {
    token,
  });
}

/**
 * Admin: Update a post
 */
export async function updatePost(
  slug: string,
  data: PostUpdate
): Promise<PostResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<PostResponse>(
    API_ENDPOINTS.admin.postBySlug(slug),
    data,
    { token }
  );
}

/**
 * Admin: Delete a post
 */
export async function deletePost(slug: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  await apiClient.delete(API_ENDPOINTS.admin.postBySlug(slug), { token });
}

/**
 * Admin: Publish a post
 */
export async function publishPost(slug: string): Promise<PostResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<PostResponse>(API_ENDPOINTS.admin.publishPost(slug), undefined, {
    token,
  });
}

/**
 * Admin: Unpublish a post
 */
export async function unpublishPost(slug: string): Promise<PostResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<PostResponse>(API_ENDPOINTS.admin.unpublishPost(slug), undefined, {
    token,
  });
}

/**
 * Public: Get published posts
 */
export async function getPublishedPosts(): Promise<PostSummaryResponse[]> {
  return apiClient.get<PostSummaryResponse[]>(API_ENDPOINTS.content.posts);
}

/**
 * Public: Get featured posts
 */
export async function getFeaturedPosts(): Promise<PostSummaryResponse[]> {
  return apiClient.get<PostSummaryResponse[]>(API_ENDPOINTS.content.featuredPosts);
}

/**
 * Public: Get a published post by slug
 */
export async function getPublishedPostBySlug(slug: string): Promise<PostResponse> {
  return apiClient.get<PostResponse>(API_ENDPOINTS.content.postBySlug(slug));
}

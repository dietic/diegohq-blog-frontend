'use server';

import { getAccessToken } from '@/lib/auth';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { ItemCreate, ItemUpdate, ItemResponse } from '@/lib/api/types';

/**
 * Admin: Get all items
 */
export async function getAllItems(): Promise<ItemResponse[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<ItemResponse[]>(API_ENDPOINTS.admin.items, { token });
}

/**
 * Admin: Get an item by ID
 */
export async function getItemById(itemId: string): Promise<ItemResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<ItemResponse>(API_ENDPOINTS.admin.itemById(itemId), {
    token,
  });
}

/**
 * Admin: Create a new item
 */
export async function createItem(data: ItemCreate): Promise<ItemResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<ItemResponse>(API_ENDPOINTS.admin.items, data, {
    token,
  });
}

/**
 * Admin: Update an item
 */
export async function updateItem(
  itemId: string,
  data: ItemUpdate
): Promise<ItemResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<ItemResponse>(
    API_ENDPOINTS.admin.itemById(itemId),
    data,
    { token }
  );
}

/**
 * Admin: Delete an item
 */
export async function deleteItem(itemId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  await apiClient.delete(API_ENDPOINTS.admin.itemById(itemId), { token });
}

/**
 * Public: Get all items
 */
export async function getPublicItems(): Promise<ItemResponse[]> {
  return apiClient.get<ItemResponse[]>(API_ENDPOINTS.content.items);
}

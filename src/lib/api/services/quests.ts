'use server';

import { getAccessToken } from '@/lib/auth';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { QuestCreate, QuestUpdate, QuestResponse } from '@/lib/api/types';

/**
 * Admin: Get all quests
 */
export async function getAllQuests(): Promise<QuestResponse[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<QuestResponse[]>(API_ENDPOINTS.admin.quests, { token });
}

/**
 * Admin: Get a quest by ID
 */
export async function getQuestById(questId: string): Promise<QuestResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<QuestResponse>(API_ENDPOINTS.admin.questById(questId), {
    token,
  });
}

/**
 * Admin: Create a new quest
 */
export async function createQuest(data: QuestCreate): Promise<QuestResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<QuestResponse>(API_ENDPOINTS.admin.quests, data, {
    token,
  });
}

/**
 * Admin: Update a quest
 */
export async function updateQuest(
  questId: string,
  data: QuestUpdate
): Promise<QuestResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<QuestResponse>(
    API_ENDPOINTS.admin.questById(questId),
    data,
    { token }
  );
}

/**
 * Admin: Delete a quest
 */
export async function deleteQuest(questId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  await apiClient.delete(API_ENDPOINTS.admin.questById(questId), { token });
}

/**
 * Public: Get all quests
 */
export async function getPublicQuests(): Promise<QuestResponse[]> {
  return apiClient.get<QuestResponse[]>(API_ENDPOINTS.content.quests);
}

/**
 * Public: Get quests by post slug
 */
export async function getQuestsByPostSlug(
  postSlug: string
): Promise<QuestResponse[]> {
  return apiClient.get<QuestResponse[]>(
    API_ENDPOINTS.content.questsByPost(postSlug)
  );
}

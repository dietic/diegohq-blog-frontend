'use server';

import { getAccessToken } from '@/lib/auth';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  DesktopIconCreate,
  DesktopIconUpdate,
  DesktopIconResponse,
  DesktopSettingsUpdate,
  DesktopSettingsResponse,
  ReorderIconsRequest,
} from '@/lib/api/types';

/**
 * Admin: Get all desktop icons
 */
export async function getAllDesktopIcons(): Promise<DesktopIconResponse[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<DesktopIconResponse[]>(API_ENDPOINTS.admin.desktopIcons, {
    token,
  });
}

/**
 * Admin: Get a desktop icon by ID
 */
export async function getDesktopIconById(
  iconId: string
): Promise<DesktopIconResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<DesktopIconResponse>(
    API_ENDPOINTS.admin.desktopIconById(iconId),
    { token }
  );
}

/**
 * Admin: Create a new desktop icon
 */
export async function createDesktopIcon(
  data: DesktopIconCreate
): Promise<DesktopIconResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<DesktopIconResponse>(
    API_ENDPOINTS.admin.desktopIcons,
    data,
    { token }
  );
}

/**
 * Admin: Update a desktop icon
 */
export async function updateDesktopIcon(
  iconId: string,
  data: DesktopIconUpdate
): Promise<DesktopIconResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<DesktopIconResponse>(
    API_ENDPOINTS.admin.desktopIconById(iconId),
    data,
    { token }
  );
}

/**
 * Admin: Delete a desktop icon
 */
export async function deleteDesktopIcon(iconId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  await apiClient.delete(API_ENDPOINTS.admin.desktopIconById(iconId), { token });
}

/**
 * Admin: Reorder desktop icons
 */
export async function reorderDesktopIcons(
  iconIds: string[]
): Promise<DesktopIconResponse[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const data: ReorderIconsRequest = { icon_ids: iconIds };
  return apiClient.post<DesktopIconResponse[]>(
    API_ENDPOINTS.admin.reorderIcons,
    data,
    { token }
  );
}

/**
 * Admin: Get desktop settings
 */
export async function getDesktopSettings(): Promise<DesktopSettingsResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<DesktopSettingsResponse>(
    API_ENDPOINTS.admin.desktopSettings,
    { token }
  );
}

/**
 * Admin: Update desktop settings
 */
export async function updateDesktopSettings(
  data: DesktopSettingsUpdate
): Promise<DesktopSettingsResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<DesktopSettingsResponse>(
    API_ENDPOINTS.admin.desktopSettings,
    data,
    { token }
  );
}

/**
 * Public: Get visible desktop icons
 */
export async function getPublicDesktopIcons(): Promise<DesktopIconResponse[]> {
  return apiClient.get<DesktopIconResponse[]>(API_ENDPOINTS.content.desktopIcons);
}

/**
 * Public: Get desktop settings
 */
export async function getPublicDesktopSettings(): Promise<DesktopSettingsResponse> {
  return apiClient.get<DesktopSettingsResponse>(
    API_ENDPOINTS.content.desktopSettings
  );
}

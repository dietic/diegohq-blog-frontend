'use server';

import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '../client';
import type {
  ContactSubmissionResponse,
  ContactSubmissionListResponse,
  ContactReplyRequest,
} from '../types';

const BASE_PATH = '/admin/contact';

/**
 * Get all contact submissions (admin only)
 */
export async function getAllContacts(
  unreadOnly: boolean = false
): Promise<ContactSubmissionListResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams();
  if (unreadOnly) params.set('unread_only', 'true');

  const url = params.toString() ? `${BASE_PATH}?${params}` : BASE_PATH;
  return apiClient.get<ContactSubmissionListResponse>(url, { token });
}

/**
 * Get a specific contact submission (admin only)
 */
export async function getContactById(
  id: string
): Promise<ContactSubmissionResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.get<ContactSubmissionResponse>(`${BASE_PATH}/${id}`, {
    token,
  });
}

/**
 * Mark a contact submission as read (admin only)
 */
export async function markContactAsRead(
  id: string
): Promise<ContactSubmissionResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.patch<ContactSubmissionResponse>(
    `${BASE_PATH}/${id}/read`,
    {},
    { token }
  );
}

/**
 * Reply to a contact submission (admin only)
 */
export async function replyToContact(
  id: string,
  data: ContactReplyRequest
): Promise<ContactSubmissionResponse> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  return apiClient.post<ContactSubmissionResponse>(
    `${BASE_PATH}/${id}/reply`,
    data,
    { token }
  );
}

/**
 * Delete a contact submission (admin only)
 */
export async function deleteContact(id: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  await apiClient.delete(`${BASE_PATH}/${id}`, { token });
}

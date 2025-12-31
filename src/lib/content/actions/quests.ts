'use server';

import {
  getContentPath,
  writeJsonFile,
  deleteFile,
  fileExists,
} from '../utils';
import { QuestSchema, type Quest } from '../schemas/quest';

const QUESTS_DIR = getContentPath('quests');

export interface ActionResult {
  success: boolean;
  error?: string;
}

const getQuestFilename = (id: string): string => {
  return `${QUESTS_DIR}/${id}.json`;
};

export const createQuest = async (quest: Quest): Promise<ActionResult> => {
  try {
    const validated = QuestSchema.parse(quest);
    const filePath = getQuestFilename(validated.id);

    if (await fileExists(filePath)) {
      return { success: false, error: 'Quest with this id already exists' };
    }

    await writeJsonFile(filePath, validated);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create quest',
    };
  }
};

export const updateQuest = async (
  id: string,
  updates: Partial<Quest>
): Promise<ActionResult> => {
  try {
    const filePath = getQuestFilename(id);

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Quest not found' };
    }

    const { readJsonFile } = await import('../utils');
    const existing = await readJsonFile<Quest>(filePath);

    const updated = { ...existing, ...updates };
    const validated = QuestSchema.parse(updated);

    // Handle id change
    const newFilePath = getQuestFilename(validated.id);
    if (newFilePath !== filePath) {
      if (await fileExists(newFilePath)) {
        return { success: false, error: 'Quest with new id already exists' };
      }
      await deleteFile(filePath);
    }

    await writeJsonFile(newFilePath, validated);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update quest',
    };
  }
};

export const deleteQuest = async (id: string): Promise<ActionResult> => {
  try {
    const filePath = getQuestFilename(id);

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Quest not found' };
    }

    await deleteFile(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quest',
    };
  }
};

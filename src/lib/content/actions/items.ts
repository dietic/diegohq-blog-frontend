'use server';

import { getContentPath, writeJsonFile, deleteFile, fileExists } from '../utils';
import { ItemSchema, type Item } from '../schemas/item';

const ITEMS_DIR = getContentPath('items');

export interface ActionResult {
  success: boolean;
  error?: string;
}

const getItemFilename = (id: string): string => {
  return `${ITEMS_DIR}/${id}.json`;
};

export const createItem = async (item: Item): Promise<ActionResult> => {
  try {
    const validated = ItemSchema.parse(item);
    const filePath = getItemFilename(validated.id);

    if (await fileExists(filePath)) {
      return { success: false, error: 'Item with this id already exists' };
    }

    await writeJsonFile(filePath, validated);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item',
    };
  }
};

export const updateItem = async (
  id: string,
  updates: Partial<Item>
): Promise<ActionResult> => {
  try {
    const filePath = getItemFilename(id);

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Item not found' };
    }

    const { readJsonFile } = await import('../utils');
    const existing = await readJsonFile<Item>(filePath);

    const updated = { ...existing, ...updates };
    const validated = ItemSchema.parse(updated);

    // Handle id change
    const newFilePath = getItemFilename(validated.id);
    if (newFilePath !== filePath) {
      if (await fileExists(newFilePath)) {
        return { success: false, error: 'Item with new id already exists' };
      }
      await deleteFile(filePath);
    }

    await writeJsonFile(newFilePath, validated);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    };
  }
};

export const deleteItem = async (id: string): Promise<ActionResult> => {
  try {
    const filePath = getItemFilename(id);

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Item not found' };
    }

    await deleteFile(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete item',
    };
  }
};

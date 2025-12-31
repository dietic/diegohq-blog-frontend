import { getContentPath, listFiles, readJsonFile } from '../utils';
import { ItemSchema, type Item } from '../schemas/item';

const ITEMS_DIR = getContentPath('items');

export const getAllItems = async (): Promise<Item[]> => {
  const files = await listFiles(ITEMS_DIR, '.json');

  const items = await Promise.all(
    files.map(async (filename) => {
      const filePath = `${ITEMS_DIR}/${filename}`;
      const data = await readJsonFile<Item>(filePath);

      // Validate item data
      return ItemSchema.parse(data);
    })
  );

  return items;
};

export const getItemById = async (id: string): Promise<Item | null> => {
  const filePath = `${ITEMS_DIR}/${id}.json`;

  try {
    const data = await readJsonFile<Item>(filePath);
    return ItemSchema.parse(data);
  } catch {
    return null;
  }
};

export const getItemsByRarity = async (
  rarity: Item['rarity']
): Promise<Item[]> => {
  const allItems = await getAllItems();
  return allItems.filter((item) => item.rarity === rarity);
};

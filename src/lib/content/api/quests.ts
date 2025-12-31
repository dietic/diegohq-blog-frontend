import { getContentPath, listFiles, readJsonFile } from '../utils';
import { QuestSchema, type Quest } from '../schemas/quest';

const QUESTS_DIR = getContentPath('quests');

export const getAllQuests = async (): Promise<Quest[]> => {
  const files = await listFiles(QUESTS_DIR, '.json');

  const quests = await Promise.all(
    files.map(async (filename) => {
      const filePath = `${QUESTS_DIR}/${filename}`;
      const data = await readJsonFile<Quest>(filePath);

      // Validate quest data
      return QuestSchema.parse(data);
    })
  );

  return quests;
};

export const getQuestById = async (id: string): Promise<Quest | null> => {
  const filePath = `${QUESTS_DIR}/${id}.json`;

  try {
    const data = await readJsonFile<Quest>(filePath);
    return QuestSchema.parse(data);
  } catch {
    return null;
  }
};

export const getQuestsByPostSlug = async (
  postSlug: string
): Promise<Quest[]> => {
  const allQuests = await getAllQuests();
  return allQuests.filter((quest) => quest.hostPostSlug === postSlug);
};

export const getQuestsWithItemReward = async (
  itemId: string
): Promise<Quest[]> => {
  const allQuests = await getAllQuests();
  return allQuests.filter((quest) => quest.itemReward === itemId);
};

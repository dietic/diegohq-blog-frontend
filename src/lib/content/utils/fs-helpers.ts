import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export const getContentPath = (...segments: string[]): string => {
  return path.join(CONTENT_DIR, ...segments);
};

export const readFile = async (filePath: string): Promise<string> => {
  return fs.readFile(filePath, 'utf-8');
};

export const writeFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
};

export const deleteFile = async (filePath: string): Promise<void> => {
  await fs.unlink(filePath);
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const listFiles = async (
  dirPath: string,
  extension?: string
): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let files = entries.filter((e) => e.isFile()).map((e) => e.name);

    if (extension) {
      files = files.filter((f) => f.endsWith(extension));
    }

    return files;
  } catch {
    return [];
  }
};

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const content = await readFile(filePath);
  return JSON.parse(content) as T;
};

export const writeJsonFile = async <T>(
  filePath: string,
  data: T
): Promise<void> => {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content);
};

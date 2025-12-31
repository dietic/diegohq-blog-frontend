import { getContentPath, readFile, readJsonFile, parseMdx } from '../utils';
import {
  DesktopIconsFileSchema,
  type DesktopIcon,
  type DesktopIconsFile,
  type DesktopSettings,
} from '../schemas/desktop-icon';
import {
  WindowContentFrontmatterSchema,
  type WindowContent,
  type WindowContentFrontmatter,
} from '../schemas/window';

const DESKTOP_DIR = getContentPath('desktop');
const ICONS_FILE = `${DESKTOP_DIR}/icons.json`;
const WINDOWS_DIR = `${DESKTOP_DIR}/windows`;

export const getDesktopIconsFile = async (): Promise<DesktopIconsFile> => {
  const data = await readJsonFile<DesktopIconsFile>(ICONS_FILE);
  return DesktopIconsFileSchema.parse(data);
};

export const getDesktopIcons = async (): Promise<DesktopIcon[]> => {
  const file = await getDesktopIconsFile();
  return file.icons;
};

export const getVisibleDesktopIcons = async (): Promise<DesktopIcon[]> => {
  const icons = await getDesktopIcons();
  return icons.filter((icon) => icon.visible);
};

export const getAccessibleDesktopIcons = async (
  userLevel: number,
  userItems: string[]
): Promise<DesktopIcon[]> => {
  const visibleIcons = await getVisibleDesktopIcons();

  return visibleIcons.filter((icon) => {
    // Check level requirement
    if (icon.requiredLevel && userLevel < icon.requiredLevel) {
      return false;
    }

    // Check item requirement
    if (icon.requiredItem && !userItems.includes(icon.requiredItem)) {
      return false;
    }

    return true;
  });
};

export const getDesktopIconById = async (
  id: string
): Promise<DesktopIcon | null> => {
  const icons = await getDesktopIcons();
  return icons.find((icon) => icon.id === id) ?? null;
};

export const getDesktopSettings = async (): Promise<DesktopSettings> => {
  const file = await getDesktopIconsFile();
  return (
    file.settings ?? {
      gridSize: 80,
      iconSpacing: 16,
    }
  );
};

export const getWindowContent = async (
  id: string
): Promise<WindowContent | null> => {
  const filePath = `${WINDOWS_DIR}/${id}.mdx`;

  try {
    const fileContent = await readFile(filePath);
    const { frontmatter, content } =
      parseMdx<WindowContentFrontmatter>(fileContent);

    // Validate frontmatter
    const validated = WindowContentFrontmatterSchema.parse(frontmatter);

    return {
      ...validated,
      content,
    };
  } catch {
    return null;
  }
};

export const getAllWindowContents = async (): Promise<WindowContent[]> => {
  const { listFiles } = await import('../utils/fs-helpers');
  const files = await listFiles(WINDOWS_DIR, '.mdx');

  const windows = await Promise.all(
    files.map(async (filename) => {
      const id = filename.replace('.mdx', '');
      return getWindowContent(id);
    })
  );

  return windows.filter((w): w is WindowContent => w !== null);
};

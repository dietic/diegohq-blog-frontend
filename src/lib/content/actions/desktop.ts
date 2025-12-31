'use server';

import {
  getContentPath,
  writeJsonFile,
  deleteFile,
  fileExists,
  readJsonFile,
  writeFile,
  serializeMdx,
} from '../utils';
import {
  DesktopIconsFileSchema,
  DesktopIconSchema,
  type DesktopIcon,
  type DesktopIconsFile,
} from '../schemas/desktop-icon';
import {
  WindowContentFrontmatterSchema,
  type WindowContentFrontmatter,
} from '../schemas/window';

const DESKTOP_DIR = getContentPath('desktop');
const ICONS_FILE = `${DESKTOP_DIR}/icons.json`;
const WINDOWS_DIR = `${DESKTOP_DIR}/windows`;

export interface ActionResult {
  success: boolean;
  error?: string;
}

// Desktop Icons Actions

export const updateDesktopIcons = async (
  icons: DesktopIcon[]
): Promise<ActionResult> => {
  try {
    // Validate all icons
    const validated = icons.map((icon) => DesktopIconSchema.parse(icon));

    // Read current file to preserve settings
    const currentFile = await readJsonFile<DesktopIconsFile>(ICONS_FILE);

    const updatedFile: DesktopIconsFile = {
      icons: validated,
      settings: currentFile.settings,
    };

    DesktopIconsFileSchema.parse(updatedFile);
    await writeJsonFile(ICONS_FILE, updatedFile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update icons',
    };
  }
};

export const addDesktopIcon = async (
  icon: DesktopIcon
): Promise<ActionResult> => {
  try {
    const validated = DesktopIconSchema.parse(icon);

    const currentFile = await readJsonFile<DesktopIconsFile>(ICONS_FILE);

    // Check if icon with same id exists
    if (currentFile.icons.some((i) => i.id === validated.id)) {
      return { success: false, error: 'Icon with this id already exists' };
    }

    currentFile.icons.push(validated);
    await writeJsonFile(ICONS_FILE, currentFile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add icon',
    };
  }
};

export const updateDesktopIcon = async (
  id: string,
  updates: Partial<DesktopIcon>
): Promise<ActionResult> => {
  try {
    const currentFile = await readJsonFile<DesktopIconsFile>(ICONS_FILE);

    const index = currentFile.icons.findIndex((i) => i.id === id);
    if (index === -1) {
      return { success: false, error: 'Icon not found' };
    }

    const updatedIcon = { ...currentFile.icons[index], ...updates };
    const validated = DesktopIconSchema.parse(updatedIcon);

    currentFile.icons[index] = validated;
    await writeJsonFile(ICONS_FILE, currentFile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update icon',
    };
  }
};

export const deleteDesktopIcon = async (id: string): Promise<ActionResult> => {
  try {
    const currentFile = await readJsonFile<DesktopIconsFile>(ICONS_FILE);

    const index = currentFile.icons.findIndex((i) => i.id === id);
    if (index === -1) {
      return { success: false, error: 'Icon not found' };
    }

    currentFile.icons.splice(index, 1);
    await writeJsonFile(ICONS_FILE, currentFile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete icon',
    };
  }
};

export const reorderDesktopIcons = async (
  iconIds: string[]
): Promise<ActionResult> => {
  try {
    const currentFile = await readJsonFile<DesktopIconsFile>(ICONS_FILE);

    // Reorder icons based on provided order
    const reordered = iconIds
      .map((id, index) => {
        const icon = currentFile.icons.find((i) => i.id === id);
        if (icon) {
          return { ...icon, order: index };
        }
        return null;
      })
      .filter((i): i is DesktopIcon => i !== null);

    currentFile.icons = reordered;
    await writeJsonFile(ICONS_FILE, currentFile);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder icons',
    };
  }
};

// Window Content Actions

export interface CreateWindowInput {
  frontmatter: WindowContentFrontmatter;
  content: string;
}

export const createWindowContent = async (
  input: CreateWindowInput
): Promise<ActionResult> => {
  try {
    const validated = WindowContentFrontmatterSchema.parse(input.frontmatter);
    const filePath = `${WINDOWS_DIR}/${validated.id}.mdx`;

    if (await fileExists(filePath)) {
      return {
        success: false,
        error: 'Window content with this id already exists',
      };
    }

    const mdxContent = serializeMdx(validated, input.content);
    await writeFile(filePath, mdxContent);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create window content',
    };
  }
};

export const updateWindowContent = async (
  id: string,
  frontmatter: Partial<WindowContentFrontmatter>,
  content?: string
): Promise<ActionResult> => {
  try {
    const filePath = `${WINDOWS_DIR}/${id}.mdx`;

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Window content not found' };
    }

    // Read existing content
    const { readFile, parseMdx } = await import('../utils');
    const fileContent = await readFile(filePath);
    const { frontmatter: existing, content: existingContent } =
      parseMdx<WindowContentFrontmatter>(fileContent);

    const updatedFrontmatter = { ...existing, ...frontmatter };
    const validated = WindowContentFrontmatterSchema.parse(updatedFrontmatter);

    const updatedContent = content ?? existingContent;
    const mdxContent = serializeMdx(validated, updatedContent);

    await writeFile(filePath, mdxContent);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update window content',
    };
  }
};

export const deleteWindowContent = async (
  id: string
): Promise<ActionResult> => {
  try {
    const filePath = `${WINDOWS_DIR}/${id}.mdx`;

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Window content not found' };
    }

    await deleteFile(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete window content',
    };
  }
};

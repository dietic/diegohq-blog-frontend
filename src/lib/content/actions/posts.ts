'use server';

import {
  getContentPath,
  writeFile,
  deleteFile,
  fileExists,
  serializeMdx,
} from '../utils';
import { PostFrontmatterSchema, type PostFrontmatter } from '../schemas/post';

const POSTS_DIR = getContentPath('posts');

export interface CreatePostInput {
  frontmatter: PostFrontmatter;
  content: string;
}

export interface UpdatePostInput {
  slug: string;
  frontmatter: Partial<PostFrontmatter>;
  content?: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

const getPostFilename = (slug: string): string => {
  return `${POSTS_DIR}/${slug}.mdx`;
};

export const createPost = async (
  input: CreatePostInput
): Promise<ActionResult> => {
  try {
    // Validate frontmatter
    const validated = PostFrontmatterSchema.parse(input.frontmatter);
    const filePath = getPostFilename(validated.slug);

    // Check if post already exists
    if (await fileExists(filePath)) {
      return { success: false, error: 'Post with this slug already exists' };
    }

    // Create MDX file
    const mdxContent = serializeMdx(validated, input.content);
    await writeFile(filePath, mdxContent);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post',
    };
  }
};

export const updatePost = async (
  input: UpdatePostInput
): Promise<ActionResult> => {
  try {
    const filePath = getPostFilename(input.slug);

    // Check if post exists
    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Post not found' };
    }

    // Read existing post
    const { readFile, parseMdx } = await import('../utils');
    const fileContent = await readFile(filePath);
    const { frontmatter, content } = parseMdx<PostFrontmatter>(fileContent);

    // Merge frontmatter
    const updatedFrontmatter = { ...frontmatter, ...input.frontmatter };
    const validated = PostFrontmatterSchema.parse(updatedFrontmatter);

    // Use new content if provided
    const updatedContent = input.content ?? content;

    // Handle slug change
    const newFilePath = getPostFilename(validated.slug);
    if (newFilePath !== filePath) {
      // Check if new slug already exists
      if (await fileExists(newFilePath)) {
        return { success: false, error: 'Post with new slug already exists' };
      }
      // Delete old file
      await deleteFile(filePath);
    }

    // Write updated file
    const mdxContent = serializeMdx(validated, updatedContent);
    await writeFile(newFilePath, mdxContent);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post',
    };
  }
};

export const deletePost = async (slug: string): Promise<ActionResult> => {
  try {
    const filePath = getPostFilename(slug);

    if (!(await fileExists(filePath))) {
      return { success: false, error: 'Post not found' };
    }

    await deleteFile(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post',
    };
  }
};

export const publishPost = async (slug: string): Promise<ActionResult> => {
  return updatePost({ slug, frontmatter: { published: true } });
};

export const unpublishPost = async (slug: string): Promise<ActionResult> => {
  return updatePost({ slug, frontmatter: { published: false } });
};

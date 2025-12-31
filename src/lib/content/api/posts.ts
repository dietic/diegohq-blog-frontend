import { getContentPath, listFiles, readFile, parseMdx } from '../utils';
import { getReadingTimeMinutes } from '../utils/reading-time';
import {
  PostFrontmatterSchema,
  type Post,
  type PostFrontmatter,
} from '../schemas/post';

const POSTS_DIR = getContentPath('posts');

export interface PostListItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  contentPillar: PostFrontmatter['contentPillar'];
  targetLevel: PostFrontmatter['targetLevel'];
  tags?: string[];
  readingTime: number;
  readXp: number;
  requiredLevel?: number;
  requiredItem?: string;
  published: boolean;
  featured: boolean;
}

const parsePostFile = async (
  filePath: string
): Promise<{ frontmatter: PostFrontmatter; content: string }> => {
  const fileContent = await readFile(filePath);
  const { frontmatter, content } = parseMdx<PostFrontmatter>(fileContent);

  // Validate frontmatter
  const validated = PostFrontmatterSchema.parse(frontmatter);

  return { frontmatter: validated, content };
};

export const getAllPosts = async (): Promise<PostListItem[]> => {
  const files = await listFiles(POSTS_DIR, '.mdx');

  const posts = await Promise.all(
    files.map(async (filename) => {
      const filePath = `${POSTS_DIR}/${filename}`;
      const { frontmatter, content } = await parsePostFile(filePath);

      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        date: frontmatter.date,
        contentPillar: frontmatter.contentPillar,
        targetLevel: frontmatter.targetLevel,
        tags: frontmatter.tags,
        readingTime: getReadingTimeMinutes(content),
        readXp: frontmatter.readXp,
        requiredLevel: frontmatter.requiredLevel,
        requiredItem: frontmatter.requiredItem,
        published: frontmatter.published,
        featured: frontmatter.featured,
      };
    })
  );

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getPublishedPosts = async (): Promise<PostListItem[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.published);
};

export const getFeaturedPosts = async (): Promise<PostListItem[]> => {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts.filter((post) => post.featured);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const files = await listFiles(POSTS_DIR, '.mdx');

  for (const filename of files) {
    const filePath = `${POSTS_DIR}/${filename}`;
    const { frontmatter, content } = await parsePostFile(filePath);

    if (frontmatter.slug === slug) {
      return {
        ...frontmatter,
        content,
        readingTime: getReadingTimeMinutes(content),
      };
    }
  }

  return null;
};

export const getPostsByContentPillar = async (
  pillar: PostFrontmatter['contentPillar']
): Promise<PostListItem[]> => {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts.filter((post) => post.contentPillar === pillar);
};

export const getPostsByTag = async (tag: string): Promise<PostListItem[]> => {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts.filter((post) => post.tags?.includes(tag));
};

export const getAccessiblePosts = async (
  userLevel: number,
  userItems: string[]
): Promise<PostListItem[]> => {
  const publishedPosts = await getPublishedPosts();

  return publishedPosts.filter((post) => {
    // Check level requirement
    if (post.requiredLevel && userLevel < post.requiredLevel) {
      return false;
    }

    // Check item requirement
    if (post.requiredItem && !userItems.includes(post.requiredItem)) {
      return false;
    }

    return true;
  });
};

export const getRelatedPosts = async (
  slug: string,
  limit: number = 3
): Promise<PostListItem[]> => {
  const currentPost = await getPostBySlug(slug);
  if (!currentPost) return [];

  const publishedPosts = await getPublishedPosts();

  // Score posts by relevance
  const scored = publishedPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;

      // Same content pillar
      if (post.contentPillar === currentPost.contentPillar) {
        score += 3;
      }

      // Same target level
      if (post.targetLevel === currentPost.targetLevel) {
        score += 2;
      }

      // Shared tags
      const sharedTags = post.tags?.filter((tag) =>
        currentPost.tags?.includes(tag)
      );
      score += (sharedTags?.length ?? 0) * 2;

      return { post, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
};

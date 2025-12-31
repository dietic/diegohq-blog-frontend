import { z } from 'zod';

export const ContentPillarSchema = z.enum([
  'programming',
  'growth-career',
  'saas-journey',
]);

export const TargetLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

export const PostFrontmatterSchema = z.object({
  // Core metadata
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300),
  date: z.string(),
  author: z.string().default('Diego'),

  // Content categorization
  contentPillar: ContentPillarSchema,
  targetLevel: TargetLevelSchema,
  tags: z.array(z.string()).optional(),

  // Gamification - Gating
  requiredLevel: z.number().int().min(1).optional(),
  requiredItem: z.string().optional(),
  challengeText: z.string().optional(),

  // Gamification - Rewards
  readXp: z.number().int().min(0).default(10),
  questId: z.string().optional(),

  // SEO
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().optional(),

  // Publishing
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: number;
}

export type ContentPillar = z.infer<typeof ContentPillarSchema>;
export type TargetLevel = z.infer<typeof TargetLevelSchema>;

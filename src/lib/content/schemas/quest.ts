import { z } from 'zod';

export const QuestTypeSchema = z.enum([
  'multiple-choice',
  'text-input',
  'call-to-action',
]);

export const QuestDifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const QuestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500),

  // Quest content
  prompt: z.string(),
  type: QuestTypeSchema,
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),

  // Rewards
  xpReward: z.number().int().min(1),
  itemReward: z.string().optional(),

  // Relationships
  hostPostSlug: z.string(),

  // Metadata
  difficulty: QuestDifficultySchema.default('easy'),
});

export type Quest = z.infer<typeof QuestSchema>;
export type QuestType = z.infer<typeof QuestTypeSchema>;
export type QuestDifficulty = z.infer<typeof QuestDifficultySchema>;

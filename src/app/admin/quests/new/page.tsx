'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createQuest } from '@/lib/api/services/quests';
import type { QuestCreate, QuestType, QuestDifficulty } from '@/lib/api/types';

const questTypes: QuestType[] = [
  'multiple-choice',
  'text-input',
  'call-to-action',
];
const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard'];

export const NewQuestPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    prompt: '',
    type: 'multiple-choice' as QuestType,
    options: '',
    correctAnswer: '',
    xpReward: 30,
    itemReward: '',
    hostPostSlug: '',
    difficulty: 'easy' as QuestDifficulty,
  });

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      id: prev.id || generateId(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const questData: QuestCreate = {
        quest_id: formData.id,
        name: formData.name,
        description: formData.description,
        prompt: formData.prompt,
        quest_type: formData.type,
        options: formData.options ? formData.options.split('\n').filter((o) => o.trim()) : [],
        correct_answer: formData.correctAnswer || null,
        xp_reward: formData.xpReward,
        item_reward: formData.itemReward || null,
        host_post_slug: formData.hostPostSlug,
        difficulty: formData.difficulty,
      };

      await createQuest(questData);
      router.push('/admin/quests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">New Quest</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/quests" style={{ color: '#71717a' }}>
              Quests
            </Link>
            {' / '}
            New
          </p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label className="form__label">Name *</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="The First Chronicler"
            maxLength={100}
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label">ID *</label>
          <input
            type="text"
            className="input"
            value={formData.id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id: e.target.value }))
            }
            pattern="^[a-z0-9-]+$"
            required
          />
          <p className="form__hint">
            Unique identifier (lowercase, hyphens only)
          </p>
        </div>

        <div className="form__group">
          <label className="form__label">Description *</label>
          <textarea
            className="textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="A brief description of the quest..."
            maxLength={500}
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label">Host Post Slug *</label>
          <input
            type="text"
            className="input"
            value={formData.hostPostSlug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hostPostSlug: e.target.value }))
            }
            placeholder="intro-to-git"
            required
          />
          <p className="form__hint">
            The slug of the post where this quest appears
          </p>
        </div>

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Type *</label>
            <select
              className="select"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as QuestType,
                }))
              }
            >
              {questTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form__group">
            <label className="form__label">Difficulty</label>
            <select
              className="select"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  difficulty: e.target.value as QuestDifficulty,
                }))
              }
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form__group">
          <label className="form__label">Prompt *</label>
          <textarea
            className="textarea"
            value={formData.prompt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, prompt: e.target.value }))
            }
            placeholder="What question will you ask the reader?"
            required
          />
        </div>

        {formData.type === 'multiple-choice' && (
          <div className="form__group">
            <label className="form__label">Options</label>
            <textarea
              className="textarea"
              value={formData.options}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, options: e.target.value }))
              }
              placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
            />
            <p className="form__hint">One option per line</p>
          </div>
        )}

        {(formData.type === 'multiple-choice' ||
          formData.type === 'text-input') && (
          <div className="form__group">
            <label className="form__label">Correct Answer</label>
            <input
              type="text"
              className="input"
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  correctAnswer: e.target.value,
                }))
              }
              placeholder="The correct answer"
            />
          </div>
        )}

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">XP Reward *</label>
            <input
              type="number"
              className="input"
              value={formData.xpReward}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  xpReward: parseInt(e.target.value) || 30,
                }))
              }
              min={1}
              required
            />
          </div>

          <div className="form__group">
            <label className="form__label">Item Reward</label>
            <input
              type="text"
              className="input"
              value={formData.itemReward}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, itemReward: e.target.value }))
              }
              placeholder="item-id"
            />
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quest'}
          </button>
          <Link href="/admin/quests" className="btn btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewQuestPage;

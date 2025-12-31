'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateQuest, deleteQuest } from '@/lib/content/actions';
import type { Quest, QuestType, QuestDifficulty } from '@/lib/content/schemas';

const questTypes: QuestType[] = [
  'multiple-choice',
  'text-input',
  'call-to-action',
];
const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard'];

interface EditQuestFormProps {
  quest: Quest;
}

export const EditQuestForm = ({ quest }: EditQuestFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: quest.name,
    description: quest.description,
    prompt: quest.prompt,
    type: quest.type,
    options: quest.options?.join('\n') || '',
    correctAnswer: quest.correctAnswer || '',
    xpReward: quest.xpReward,
    itemReward: quest.itemReward || '',
    hostPostSlug: quest.hostPostSlug,
    difficulty: quest.difficulty,
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updates: Partial<Quest> = {
      name: formData.name,
      description: formData.description,
      prompt: formData.prompt,
      type: formData.type,
      options: formData.options
        ? formData.options.split('\n').filter((o) => o.trim())
        : undefined,
      correctAnswer: formData.correctAnswer || undefined,
      xpReward: formData.xpReward,
      itemReward: formData.itemReward || undefined,
      hostPostSlug: formData.hostPostSlug,
      difficulty: formData.difficulty,
    };

    const result = await updateQuest(quest.id, updates);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to update quest');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quest?')) {
      return;
    }

    setLoading(true);
    const result = await deleteQuest(quest.id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/quests');
    } else {
      setError(result.error || 'Failed to delete quest');
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Quest updated successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label className="form__label">Name *</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            maxLength={100}
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label">Description *</label>
          <textarea
            className="textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
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
            required
          />
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
            />
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/quests" className="btn btn--secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginLeft: 'auto' }}
          >
            Delete Quest
          </button>
        </div>
      </form>
    </>
  );
};

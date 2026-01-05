'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateQuest, deleteQuest } from '@/lib/api/services/quests';
import type { QuestResponse, QuestUpdate, QuestType, QuestDifficulty } from '@/lib/api/types';
import { features } from '@/config/features';

const questTypes: QuestType[] = [
  'multiple-choice',
  'code',
];
const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard'];

interface EditQuestFormProps {
  quest: QuestResponse;
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
    quest_type: quest.quest_type as QuestType,
    options: quest.options?.join('\n') || '',
    correct_answer: quest.correct_answer || '',
    xp_reward: quest.xp_reward,
    item_reward: quest.item_reward || '',
    difficulty: quest.difficulty as QuestDifficulty,
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

    try {
      const updates: QuestUpdate = {
        name: formData.name,
        description: formData.description,
        prompt: formData.prompt,
        quest_type: formData.quest_type,
        options: formData.options
          ? formData.options.split('\n').filter((o) => o.trim())
          : undefined,
        correct_answer: formData.correct_answer || undefined,
        xp_reward: formData.xp_reward,
        item_reward: formData.item_reward || null,
        difficulty: formData.difficulty,
      };

      await updateQuest(quest.quest_id, updates);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quest');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quest?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteQuest(quest.quest_id);
      router.push('/admin/quests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quest');
      setLoading(false);
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

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Type *</label>
            <select
              className="select"
              value={formData.quest_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quest_type: e.target.value as QuestType,
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

        {formData.quest_type === 'multiple-choice' && (
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

        {formData.quest_type === 'multiple-choice' && (
          <div className="form__group">
            <label className="form__label">Correct Answer</label>
            <input
              type="text"
              className="input"
              value={formData.correct_answer}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  correct_answer: e.target.value,
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
              value={formData.xp_reward}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  xp_reward: parseInt(e.target.value) || 30,
                }))
              }
              min={1}
              required
            />
          </div>

          {features.itemsEnabled && (
            <div className="form__group">
              <label className="form__label">Item Reward</label>
              <input
                type="text"
                className="input"
                value={formData.item_reward}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, item_reward: e.target.value }))
                }
              />
            </div>
          )}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createItem } from '@/lib/api/services/items';
import type { ItemCreate, ItemRarity } from '@/lib/api/types';

const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'legendary'];

export const NewItemPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '📦',
    rarity: 'common' as ItemRarity,
    flavorText: '',
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
      const itemData: ItemCreate = {
        item_id: formData.id,
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        rarity: formData.rarity,
        flavor_text: formData.flavorText || null,
      };

      await createItem(itemData);
      router.push('/admin/items');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">New Item</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/items" style={{ color: '#71717a' }}>
              Items
            </Link>
            {' / '}
            New
          </p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div
            className="card__body"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <span style={{ fontSize: '3rem' }}>{formData.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                {formData.name || 'New Item'}
              </div>
              <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
                {formData.rarity}
              </div>
            </div>
          </div>
        </div>

        <div className="form__group">
          <label className="form__label">Name *</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Magic Scroll"
            maxLength={50}
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

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Icon *</label>
            <input
              type="text"
              className="input"
              value={formData.icon}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon: e.target.value }))
              }
              required
            />
            <p className="form__hint">Emoji or icon path</p>
          </div>

          <div className="form__group">
            <label className="form__label">Rarity *</label>
            <select
              className="select"
              value={formData.rarity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rarity: e.target.value as ItemRarity,
                }))
              }
            >
              {rarities.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form__group">
          <label className="form__label">Description *</label>
          <textarea
            className="textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="What does this item do?"
            maxLength={200}
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label">Flavor Text</label>
          <input
            type="text"
            className="input"
            value={formData.flavorText}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, flavorText: e.target.value }))
            }
            placeholder="A witty or mysterious quote..."
            maxLength={150}
          />
          <p className="form__hint">Optional lore or fun text</p>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          <Link href="/admin/items" className="btn btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewItemPage;

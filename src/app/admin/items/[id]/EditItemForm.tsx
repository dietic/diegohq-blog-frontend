'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateItem, deleteItem } from '@/lib/content/actions';
import type { Item, ItemRarity } from '@/lib/content/schemas';

const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'legendary'];

interface EditItemFormProps {
  item: Item;
}

export const EditItemForm = ({ item }: EditItemFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    icon: item.icon,
    rarity: item.rarity,
    flavorText: item.flavorText || '',
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

    const updates: Partial<Item> = {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      rarity: formData.rarity,
      flavorText: formData.flavorText || undefined,
    };

    const result = await updateItem(item.id, updates);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to update item');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    const result = await deleteItem(item.id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/items');
    } else {
      setError(result.error || 'Failed to delete item');
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Item updated successfully!</div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div
          className="card__body"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <span style={{ fontSize: '3rem' }}>{formData.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {formData.name}
            </div>
            <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
              {item.id}
            </div>
          </div>
        </div>
      </div>

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
            maxLength={50}
            required
          />
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
            maxLength={150}
          />
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/items" className="btn btn--secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginLeft: 'auto' }}
          >
            Delete Item
          </button>
        </div>
      </form>
    </>
  );
};

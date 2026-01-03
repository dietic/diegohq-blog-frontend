'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateItem, deleteItem } from '@/lib/api/services/items';
import type { ItemResponse, ItemUpdate, ItemRarity } from '@/lib/api/types';

const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'legendary'];

interface EditItemFormProps {
  item: ItemResponse;
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
    rarity: item.rarity as ItemRarity,
    flavor_text: item.flavor_text || '',
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
      const updates: ItemUpdate = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        rarity: formData.rarity,
        flavor_text: formData.flavor_text || null,
      };

      await updateItem(item.item_id, updates);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteItem(item.item_id);
      router.push('/admin/items');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      setLoading(false);
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
              {item.item_id}
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
            value={formData.flavor_text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, flavor_text: e.target.value }))
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

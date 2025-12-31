'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { updateDesktopIcon, deleteDesktopIcon } from '@/lib/content/actions';
import type { DesktopIcon, WindowType } from '@/lib/content/schemas';

const windowTypes: WindowType[] = [
  'journal',
  'quest-log',
  'inventory',
  'profile',
  'settings',
  'custom',
  'external',
];

interface EditIconFormProps {
  icon: DesktopIcon;
}

export const EditIconForm = ({ icon }: EditIconFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    label: icon.label,
    iconPath: icon.icon,
    positionX: icon.position.x,
    positionY: icon.position.y,
    windowType: icon.windowType,
    windowId: icon.windowId || '',
    externalUrl: icon.externalUrl || '',
    visible: icon.visible,
    requiredLevel: icon.requiredLevel?.toString() || '',
    requiredItem: icon.requiredItem || '',
    order: icon.order,
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

    const updates: Partial<DesktopIcon> = {
      label: formData.label,
      icon: formData.iconPath,
      position: {
        x: formData.positionX,
        y: formData.positionY,
      },
      windowType: formData.windowType,
      windowId: formData.windowId || undefined,
      externalUrl: formData.externalUrl || undefined,
      visible: formData.visible,
      requiredLevel: formData.requiredLevel
        ? parseInt(formData.requiredLevel)
        : undefined,
      requiredItem: formData.requiredItem || undefined,
      order: formData.order,
    };

    const result = await updateDesktopIcon(icon.id, updates);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to update icon');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this icon?')) {
      return;
    }

    setLoading(true);
    const result = await deleteDesktopIcon(icon.id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/desktop');
    } else {
      setError(result.error || 'Failed to delete icon');
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Icon updated successfully!</div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div
          className="card__body"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <Image
            src={formData.iconPath}
            alt={formData.label}
            width={64}
            height={64}
            style={{ imageRendering: 'pixelated' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {formData.label}
            </div>
            <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
              {icon.id}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label className="form__label">Label *</label>
          <input
            type="text"
            className="input"
            value={formData.label}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, label: e.target.value }))
            }
            maxLength={20}
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label">Icon Path *</label>
          <input
            type="text"
            className="input"
            value={formData.iconPath}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, iconPath: e.target.value }))
            }
            required
          />
        </div>

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Position X</label>
            <input
              type="number"
              className="input"
              value={formData.positionX}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  positionX: parseInt(e.target.value) || 0,
                }))
              }
              min={0}
            />
          </div>

          <div className="form__group">
            <label className="form__label">Position Y</label>
            <input
              type="number"
              className="input"
              value={formData.positionY}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  positionY: parseInt(e.target.value) || 0,
                }))
              }
              min={0}
            />
          </div>
        </div>

        <div className="form__group">
          <label className="form__label">Window Type *</label>
          <select
            className="select"
            value={formData.windowType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                windowType: e.target.value as WindowType,
              }))
            }
          >
            {windowTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {formData.windowType === 'custom' && (
          <div className="form__group">
            <label className="form__label">Window ID</label>
            <input
              type="text"
              className="input"
              value={formData.windowId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, windowId: e.target.value }))
              }
            />
          </div>
        )}

        {formData.windowType === 'external' && (
          <div className="form__group">
            <label className="form__label">External URL</label>
            <input
              type="url"
              className="input"
              value={formData.externalUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  externalUrl: e.target.value,
                }))
              }
            />
          </div>
        )}

        <div className="form__row">
          <div className="form__group">
            <label className="form__label">Required Level</label>
            <input
              type="number"
              className="input"
              value={formData.requiredLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requiredLevel: e.target.value,
                }))
              }
              min={1}
            />
          </div>

          <div className="form__group">
            <label className="form__label">Required Item</label>
            <input
              type="text"
              className="input"
              value={formData.requiredItem}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requiredItem: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="form__group">
          <label className="form__label">Order</label>
          <input
            type="number"
            className="input"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>

        <div className="form__group">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, visible: e.target.checked }))
              }
            />
            <span>Visible on desktop</span>
          </label>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/desktop" className="btn btn--secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginLeft: 'auto' }}
          >
            Delete Icon
          </button>
        </div>
      </form>
    </>
  );
};

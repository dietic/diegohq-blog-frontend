'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addDesktopIcon } from '@/lib/content/actions';
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

export const NewIconPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    label: '',
    icon: '/desktop-icons/',
    positionX: 0,
    positionY: 0,
    windowType: 'custom' as WindowType,
    windowId: '',
    externalUrl: '',
    visible: true,
    requiredLevel: '',
    requiredItem: '',
    order: 0,
  });

  const generateId = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    setFormData((prev) => ({
      ...prev,
      label,
      id: prev.id || generateId(label),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const icon: DesktopIcon = {
      id: formData.id,
      label: formData.label,
      icon: formData.icon,
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

    const result = await addDesktopIcon(icon);
    setLoading(false);

    if (result.success) {
      router.push('/admin/desktop');
    } else {
      setError(result.error || 'Failed to add icon');
    }
  };

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">New Desktop Icon</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/desktop" style={{ color: '#71717a' }}>
              Desktop
            </Link>
            {' / '}
            New Icon
          </p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label className="form__label">Label *</label>
          <input
            type="text"
            className="input"
            value={formData.label}
            onChange={handleLabelChange}
            placeholder="My Icon"
            maxLength={20}
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
            placeholder="my-icon"
            pattern="^[a-z0-9-]+$"
            required
          />
          <p className="form__hint">
            Unique identifier (lowercase, hyphens only)
          </p>
        </div>

        <div className="form__group">
          <label className="form__label">Icon Path *</label>
          <input
            type="text"
            className="input"
            value={formData.icon}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, icon: e.target.value }))
            }
            placeholder="/desktop-icons/my-icon.png"
            required
          />
          <p className="form__hint">Path to icon image in /public folder</p>
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
              placeholder="about"
            />
            <p className="form__hint">
              ID of custom window content (from /content/desktop/windows/)
            </p>
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
              placeholder="https://example.com"
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
              placeholder="Optional"
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
              placeholder="item-id"
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
          <p className="form__hint">
            Display order (lower numbers appear first)
          </p>
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
            {loading ? 'Adding...' : 'Add Icon'}
          </button>
          <Link href="/admin/desktop" className="btn btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewIconPage;

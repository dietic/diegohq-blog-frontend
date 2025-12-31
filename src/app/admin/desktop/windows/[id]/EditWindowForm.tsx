'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  updateWindowContent,
  deleteWindowContent,
} from '@/lib/content/actions';
import type {
  WindowContent,
  WindowContentFrontmatter,
} from '@/lib/content/schemas';

interface EditWindowFormProps {
  window: WindowContent;
}

export const EditWindowForm = ({ window }: EditWindowFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: window.title,
    icon: window.icon || '',
    defaultWidth: window.defaultWidth,
    defaultHeight: window.defaultHeight,
    singleton: window.singleton,
    closable: window.closable,
    minimizable: window.minimizable,
    maximizable: window.maximizable,
    requiredLevel: window.requiredLevel?.toString() || '',
    requiredItem: window.requiredItem || '',
    content: window.content,
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

    const frontmatter: Partial<WindowContentFrontmatter> = {
      title: formData.title,
      icon: formData.icon || undefined,
      defaultWidth: formData.defaultWidth,
      defaultHeight: formData.defaultHeight,
      singleton: formData.singleton,
      closable: formData.closable,
      minimizable: formData.minimizable,
      maximizable: formData.maximizable,
      requiredLevel: formData.requiredLevel
        ? parseInt(formData.requiredLevel)
        : undefined,
      requiredItem: formData.requiredItem || undefined,
    };

    const result = await updateWindowContent(
      window.id,
      frontmatter,
      formData.content
    );
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to update window');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this window?')) {
      return;
    }

    setLoading(true);
    const result = await deleteWindowContent(window.id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/desktop/windows');
    } else {
      setError(result.error || 'Failed to delete window');
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Window updated successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="form form--wide">
        <div className="grid grid--2">
          <div>
            <div className="form__group">
              <label className="form__label">Title *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                maxLength={50}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Icon</label>
              <input
                type="text"
                className="input"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
              />
            </div>

            <div className="form__row">
              <div className="form__group">
                <label className="form__label">Default Width</label>
                <input
                  type="number"
                  className="input"
                  value={formData.defaultWidth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultWidth: parseInt(e.target.value) || 600,
                    }))
                  }
                  min={200}
                />
              </div>

              <div className="form__group">
                <label className="form__label">Default Height</label>
                <input
                  type="number"
                  className="input"
                  value={formData.defaultHeight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultHeight: parseInt(e.target.value) || 400,
                    }))
                  }
                  min={150}
                />
              </div>
            </div>

            <div className="form__group">
              <label className="form__label">Behavior</label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.singleton}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        singleton: e.target.checked,
                      }))
                    }
                  />
                  <span>Singleton</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.closable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        closable: e.target.checked,
                      }))
                    }
                  />
                  <span>Closable</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.minimizable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minimizable: e.target.checked,
                      }))
                    }
                  />
                  <span>Minimizable</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.maximizable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maximizable: e.target.checked,
                      }))
                    }
                  />
                  <span>Maximizable</span>
                </label>
              </div>
            </div>

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
          </div>

          <div>
            <div className="form__group">
              <label className="form__label">Content (MDX)</label>
              <textarea
                className="textarea textarea--code"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                style={{ height: '100%', minHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/desktop/windows" className="btn btn--secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginLeft: 'auto' }}
          >
            Delete Window
          </button>
        </div>
      </form>
    </>
  );
};

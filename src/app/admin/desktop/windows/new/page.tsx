'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createWindowContent } from '@/lib/content/actions';
import type { WindowContentFrontmatter } from '@/lib/content/schemas';

export const NewWindowPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: '',
    defaultWidth: 600,
    defaultHeight: 400,
    singleton: true,
    closable: true,
    minimizable: true,
    maximizable: true,
    requiredLevel: '',
    requiredItem: '',
    content: '',
  });

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      id: prev.id || generateId(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const frontmatter: WindowContentFrontmatter = {
      id: formData.id,
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

    const result = await createWindowContent({
      frontmatter,
      content:
        formData.content ||
        `# ${formData.title}\n\nWindow content goes here...`,
    });

    setLoading(false);

    if (result.success) {
      router.push('/admin/desktop/windows');
    } else {
      setError(result.error || 'Failed to create window');
    }
  };

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">New Window</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/desktop/windows" style={{ color: '#71717a' }}>
              Windows
            </Link>
            {' / '}
            New
          </p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="form form--wide">
        <div className="grid grid--2">
          <div>
            <div className="form__group">
              <label className="form__label">Title *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="About"
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
                Unique identifier for linking from icons
              </p>
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
                placeholder="ℹ️"
              />
              <p className="form__hint">Emoji shown in window header</p>
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
                  <span>Singleton (only one instance allowed)</span>
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
                placeholder="# Window Title&#10;&#10;Your MDX content here..."
                style={{ height: '100%', minHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Window'}
          </button>
          <Link href="/admin/desktop/windows" className="btn btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewWindowPage;

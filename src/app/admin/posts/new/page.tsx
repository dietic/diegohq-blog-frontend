'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPost } from '@/lib/content/actions';
import type { PostFrontmatter } from '@/lib/content/schemas';

export const NewPostPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    contentPillar: 'programming' as const,
    targetLevel: 'beginner' as const,
    tags: '',
    readXp: 10,
    requiredLevel: '',
    requiredItem: '',
    questId: '',
    metaDescription: '',
    published: false,
    featured: false,
    content: '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const frontmatter: PostFrontmatter = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      date: new Date().toISOString().split('T')[0],
      author: 'Diego',
      contentPillar: formData.contentPillar,
      targetLevel: formData.targetLevel,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim())
        : undefined,
      readXp: formData.readXp,
      requiredLevel: formData.requiredLevel
        ? parseInt(formData.requiredLevel)
        : undefined,
      requiredItem: formData.requiredItem || undefined,
      questId: formData.questId || undefined,
      metaDescription: formData.metaDescription || undefined,
      published: formData.published,
      featured: formData.featured,
    };

    const result = await createPost({
      frontmatter,
      content:
        formData.content ||
        '# ' + formData.title + '\n\nStart writing your post here...',
    });

    setLoading(false);

    if (result.success) {
      router.push('/admin/posts');
    } else {
      setError(result.error || 'Failed to create post');
    }
  };

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">New Post</h1>
          <p className="page-header__subtitle">Create a new journal entry</p>
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
                placeholder="My Awesome Post"
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Slug *</label>
              <input
                type="text"
                className="input"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="my-awesome-post"
                pattern="^[a-z0-9-]+$"
                required
              />
              <p className="form__hint">
                URL-friendly identifier (lowercase, hyphens only)
              </p>
            </div>

            <div className="form__group">
              <label className="form__label">Excerpt *</label>
              <textarea
                className="textarea"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="A brief summary of your post..."
                maxLength={300}
                required
              />
              <p className="form__hint">
                {formData.excerpt.length}/300 characters
              </p>
            </div>

            <div className="form__row">
              <div className="form__group">
                <label className="form__label">Content Pillar *</label>
                <select
                  className="select"
                  value={formData.contentPillar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contentPillar: e.target
                        .value as PostFrontmatter['contentPillar'],
                    }))
                  }
                >
                  <option value="programming">Programming</option>
                  <option value="growth-career">Growth & Career</option>
                  <option value="saas-journey">SaaS Journey</option>
                </select>
              </div>

              <div className="form__group">
                <label className="form__label">Target Level *</label>
                <select
                  className="select"
                  value={formData.targetLevel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetLevel: e.target
                        .value as PostFrontmatter['targetLevel'],
                    }))
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form__group">
              <label className="form__label">Tags</label>
              <input
                type="text"
                className="input"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="git, version-control, tutorial"
              />
              <p className="form__hint">Comma-separated list of tags</p>
            </div>

            <div className="form__row">
              <div className="form__group">
                <label className="form__label">Read XP</label>
                <input
                  type="number"
                  className="input"
                  value={formData.readXp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      readXp: parseInt(e.target.value) || 10,
                    }))
                  }
                  min={0}
                />
              </div>

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
                  placeholder="Optional"
                  min={1}
                />
              </div>
            </div>

            <div className="form__row">
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

              <div className="form__group">
                <label className="form__label">Quest ID</label>
                <input
                  type="text"
                  className="input"
                  value={formData.questId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      questId: e.target.value,
                    }))
                  }
                  placeholder="quest-id"
                />
              </div>
            </div>

            <div className="form__group">
              <label className="form__label">Meta Description</label>
              <input
                type="text"
                className="input"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="SEO description..."
                maxLength={160}
              />
            </div>

            <div
              className="form__group"
              style={{ display: 'flex', gap: '1.5rem' }}
            >
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                />
                <span>Published</span>
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                />
                <span>Featured</span>
              </label>
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
                placeholder="# My Post&#10;&#10;Write your content here using Markdown..."
                style={{ height: '100%', minHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <Link href="/admin/posts" className="btn btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewPostPage;

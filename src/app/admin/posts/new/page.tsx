'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPost } from '@/lib/api/services/posts';
import { MDXPreviewClient } from '@/components/mdx/MDXPreviewClient';
import type { PostCreate, ContentPillar, TargetLevel } from '@/lib/api/types';

export const NewPostPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    contentPillar: 'programming' as ContentPillar,
    targetLevel: 'beginner' as TargetLevel,
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

    try {
      const postData: PostCreate = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content || '# ' + formData.title + '\n\nStart writing your post here...',
        content_pillar: formData.contentPillar as ContentPillar,
        target_level: formData.targetLevel as TargetLevel,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        read_xp: formData.readXp,
        required_level: formData.requiredLevel ? parseInt(formData.requiredLevel) : null,
        required_item: formData.requiredItem || null,
        quest_id: formData.questId || null,
        meta_description: formData.metaDescription || null,
        published: formData.published,
        featured: formData.featured,
      };

      await createPost(postData);
      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
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
        {/* Post Settings Section */}
        <details className="form__details" open>
          <summary className="form__summary">Post Settings</summary>
          <div className="form__details-content">
            <div className="grid grid--3">
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
                  placeholder="git, tutorial"
                />
              </div>
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
                rows={2}
                required
              />
              <p className="form__hint">
                {formData.excerpt.length}/300 characters
              </p>
            </div>

            <div className="grid grid--4">
              <div className="form__group">
                <label className="form__label">Content Pillar *</label>
                <select
                  className="select"
                  value={formData.contentPillar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contentPillar: e.target.value as ContentPillar,
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
                      targetLevel: e.target.value as TargetLevel,
                    }))
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

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

            <div className="grid grid--4">
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
                style={{ display: 'flex', gap: '1rem', alignItems: 'end', paddingBottom: '0.5rem' }}
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
          </div>
        </details>

        {/* Editor and Preview Side by Side */}
        <div className="grid grid--2" style={{ marginTop: '1.5rem' }}>
          <div className="form__group">
            <label className="form__label">Content (MDX)</label>
            <textarea
              className="textarea textarea--code"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="# My Post&#10;&#10;Write your content here using MDX..."
              style={{ height: '500px', resize: 'vertical' }}
            />
          </div>

          <div className="form__group">
            <label className="form__label">Preview</label>
            <MDXPreviewClient
              content={formData.content}
              title={formData.title}
            />
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

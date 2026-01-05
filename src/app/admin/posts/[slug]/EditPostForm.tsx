'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePost, deletePost } from '@/lib/api/services/posts';
import { MDXPreviewClient } from '@/components/mdx/MDXPreviewClient';
import { QuestSelect } from '@/app/admin/components/QuestSelect';
import type { PostResponse, PostUpdate, ContentPillar, TargetLevel } from '@/lib/api/types';
import { features } from '@/config/features';

interface EditPostFormProps {
  post: PostResponse;
}

export const EditPostForm = ({ post }: EditPostFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content_pillar: post.content_pillar as ContentPillar,
    target_level: post.target_level as TargetLevel,
    tags: post.tags?.join(', ') || '',
    read_xp: post.read_xp,
    required_level: post.required_level?.toString() || '',
    required_item: post.required_item || '',
    quest_id: post.quest_id || '',
    meta_description: post.meta_description || '',
    icon: post.icon || '',
    published: post.published,
    featured: post.featured,
    content: post.content,
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
      const updateData: PostUpdate = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        content_pillar: formData.content_pillar,
        target_level: formData.target_level,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim())
          : undefined,
        read_xp: formData.read_xp,
        required_level: formData.required_level
          ? parseInt(formData.required_level)
          : null,
        required_item: formData.required_item || null,
        quest_id: formData.quest_id || null,
        meta_description: formData.meta_description || null,
        icon: formData.icon || null,
        published: formData.published,
        featured: formData.featured,
      };

      await updatePost(post.slug, updateData);
      setSuccess(true);

      if (formData.slug !== post.slug) {
        router.push(`/admin/posts/${formData.slug}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this post? This cannot be undone.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deletePost(post.slug);
      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Post updated successfully!</div>
      )}

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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
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
                  value={formData.content_pillar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content_pillar: e.target.value as ContentPillar,
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
                  value={formData.target_level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      target_level: e.target.value as TargetLevel,
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
                  value={formData.read_xp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      read_xp: parseInt(e.target.value) || 10,
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
                  value={formData.required_level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      required_level: e.target.value,
                    }))
                  }
                  min={1}
                />
              </div>
            </div>

            <div className="grid grid--4">
              {features.itemsEnabled && (
                <div className="form__group">
                  <label className="form__label">Required Item</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.required_item}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        required_item: e.target.value,
                      }))
                    }
                    placeholder="item-id"
                  />
                </div>
              )}

              <div className="form__group">
                <label className="form__label">Quest</label>
                <QuestSelect
                  value={formData.quest_id}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      quest_id: value,
                    }))
                  }
                />
              </div>

              <div className="form__group">
                <label className="form__label">Meta Description</label>
                <input
                  type="text"
                  className="input"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  placeholder="SEO description..."
                  maxLength={160}
                />
              </div>

              <div className="form__group">
                <label className="form__label">Icon</label>
                <div className="input-group">
                  <span className="input-group__prefix">/desktop-icons/</span>
                  <input
                    type="text"
                    className="input input--with-prefix"
                    value={formData.icon.replace('/desktop-icons/', '')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        icon: e.target.value ? `/desktop-icons/${e.target.value}` : '',
                      }))
                    }
                    placeholder="scroll.png"
                  />
                </div>
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/posts" className="btn btn--secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={loading}
            style={{ marginLeft: 'auto' }}
          >
            Delete Post
          </button>
        </div>
      </form>
    </>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePost, deletePost } from '@/lib/content/actions';
import type { Post, PostFrontmatter } from '@/lib/content/schemas';

interface EditPostFormProps {
  post: Post;
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
    contentPillar: post.contentPillar,
    targetLevel: post.targetLevel,
    tags: post.tags?.join(', ') || '',
    readXp: post.readXp,
    requiredLevel: post.requiredLevel?.toString() || '',
    requiredItem: post.requiredItem || '',
    questId: post.questId || '',
    metaDescription: post.metaDescription || '',
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

    const frontmatter: Partial<PostFrontmatter> = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
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

    const result = await updatePost({
      slug: post.slug,
      frontmatter,
      content: formData.content,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      if (formData.slug !== post.slug) {
        router.push(`/admin/posts/${formData.slug}`);
      }
    } else {
      setError(result.error || 'Failed to update post');
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
    const result = await deletePost(post.slug);
    setLoading(false);

    if (result.success) {
      router.push('/admin/posts');
    } else {
      setError(result.error || 'Failed to delete post');
    }
  };

  return (
    <>
      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">Post updated successfully!</div>
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
              <p className="form__hint">
                Changing the slug will update the file name
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
                style={{ height: '100%', minHeight: '500px' }}
              />
            </div>
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

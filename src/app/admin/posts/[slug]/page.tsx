import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/content';
import { EditPostForm } from './EditPostForm';

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export const EditPostPage = async ({ params }: EditPostPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit Post</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/posts" style={{ color: '#71717a' }}>
              Posts
            </Link>
            {' / '}
            {post.title}
          </p>
        </div>
        <div className="page-header__actions">
          <span
            className={`badge ${post.published ? 'badge--success' : 'badge--muted'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            {post.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <EditPostForm post={post} />
    </div>
  );
};

export default EditPostPage;

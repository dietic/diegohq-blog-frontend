import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export const PostsPage = async () => {
  const posts = await getAllPosts();

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Posts</h1>
          <p className="page-header__subtitle">Manage your journal entries</p>
        </div>
        <div className="page-header__actions">
          <Link href="/admin/posts/new" className="btn btn--primary">
            + New Post
          </Link>
        </div>
      </div>

      {posts.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Pillar</th>
              <th>Level</th>
              <th>XP</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug}>
                <td>
                  <div>
                    <strong>{post.title}</strong>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#71717a',
                        marginTop: '0.25rem',
                      }}
                    >
                      /{post.slug}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge--info">
                    {post.contentPillar}
                  </span>
                </td>
                <td>{post.targetLevel}</td>
                <td>{post.readXp} XP</td>
                <td>
                  <span
                    className={`badge ${post.published ? 'badge--success' : 'badge--muted'}`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.featured && (
                    <span
                      className="badge badge--warning"
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Featured
                    </span>
                  )}
                </td>
                <td style={{ color: '#71717a' }}>
                  {new Date(post.date).toLocaleDateString()}
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="btn btn--ghost btn--sm"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h3 className="empty-state__title">No posts yet</h3>
            <p className="empty-state__description">
              Create your first journal entry to get started.
            </p>
            <Link href="/admin/posts/new" className="btn btn--primary">
              Create First Post
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;

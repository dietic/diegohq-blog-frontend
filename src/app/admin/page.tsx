import Link from 'next/link';
import {
  getAllPosts,
  getAllQuests,
  getAllItems,
  getDesktopIcons,
} from '@/lib/content';

export const AdminDashboard = async () => {
  const [posts, quests, items, icons] = await Promise.all([
    getAllPosts(),
    getAllQuests(),
    getAllItems(),
    getDesktopIcons(),
  ]);

  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      meta: `${publishedPosts.length} published, ${draftPosts.length} drafts`,
      href: '/admin/posts',
    },
    {
      label: 'Quests',
      value: quests.length,
      meta: 'Active challenges',
      href: '/admin/quests',
    },
    {
      label: 'Items',
      value: items.length,
      meta: 'Collectibles',
      href: '/admin/items',
    },
    {
      label: 'Desktop Icons',
      value: icons.length,
      meta: 'Visible on desktop',
      href: '/admin/desktop',
    },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Dashboard</h1>
          <p className="page-header__subtitle">
            Welcome to The Adventurer&apos;s Journal CMS
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ textDecoration: 'none' }}
          >
            <div className="stat-card">
              <div className="stat-card__label">{stat.label}</div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__meta">{stat.meta}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid--2">
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Recent Posts</h3>
            <Link href="/admin/posts" className="btn btn--ghost btn--sm">
              View All
            </Link>
          </div>
          <div className="card__body">
            {recentPosts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.slug}>
                      <td>
                        <Link
                          href={`/admin/posts/${post.slug}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td>
                        <span
                          className={`badge ${post.published ? 'badge--success' : 'badge--muted'}`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ color: '#71717a' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p className="empty-state__description">No posts yet</p>
                <Link
                  href="/admin/posts/new"
                  className="btn btn--primary btn--sm"
                >
                  Create First Post
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Quick Actions</h3>
          </div>
          <div className="card__body">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <Link href="/admin/posts/new" className="btn btn--secondary">
                📝 Create New Post
              </Link>
              <Link href="/admin/quests/new" className="btn btn--secondary">
                ⚔️ Create New Quest
              </Link>
              <Link href="/admin/items/new" className="btn btn--secondary">
                🎒 Create New Item
              </Link>
              <Link href="/admin/desktop" className="btn btn--secondary">
                🖥️ Manage Desktop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

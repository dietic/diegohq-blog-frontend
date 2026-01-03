import Link from 'next/link';
import {
  FileText,
  Swords,
  Package,
  Plus,
} from 'lucide-react';
import { getAllPosts } from '@/lib/api/services/posts';
import { getAllQuests } from '@/lib/api/services/quests';
import { getAllItems } from '@/lib/api/services/items';

async function safeGetPosts() {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

async function safeGetQuests() {
  try {
    return await getAllQuests();
  } catch (error) {
    console.error('Failed to fetch quests:', error);
    return [];
  }
}

async function safeGetItems() {
  try {
    return await getAllItems();
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return [];
  }
}

export const AdminDashboard = async () => {
  const [posts, quests, items] = await Promise.all([
    safeGetPosts(),
    safeGetQuests(),
    safeGetItems(),
  ]);

  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      meta: `${publishedPosts.length} published, ${draftPosts.length} drafts`,
      href: '/admin/posts',
      icon: <FileText size={20} />,
    },
    {
      label: 'Quests',
      value: quests.length,
      meta: 'Active challenges',
      href: '/admin/quests',
      icon: <Swords size={20} />,
    },
    {
      label: 'Items',
      value: items.length,
      meta: 'Collectibles',
      href: '/admin/items',
      icon: <Package size={20} />,
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
              <div className="stat-card__icon">{stat.icon}</div>
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
                        {new Date(post.created_at).toLocaleDateString()}
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
                <Plus size={16} />
                Create New Post
              </Link>
              <Link href="/admin/quests/new" className="btn btn--secondary">
                <Plus size={16} />
                Create New Quest
              </Link>
              <Link href="/admin/items/new" className="btn btn--secondary">
                <Plus size={16} />
                Create New Item
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

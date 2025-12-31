import Link from 'next/link';
import { ReactNode } from 'react';
import './admin.scss';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/posts', label: 'Posts', icon: '📝' },
  { href: '/admin/desktop', label: 'Desktop', icon: '🖥️' },
  { href: '/admin/quests', label: 'Quests', icon: '⚔️' },
  { href: '/admin/items', label: 'Items', icon: '🎒' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__logo">
          <Link href="/admin">
            <span className="admin__logo-icon">⚙️</span>
            <span className="admin__logo-text">Journal CMS</span>
          </Link>
        </div>
        <nav className="admin__nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="admin__nav-item">
              <span className="admin__nav-icon">{item.icon}</span>
              <span className="admin__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin__sidebar-footer">
          <Link href="/" className="admin__back-link">
            ← Back to Site
          </Link>
        </div>
      </aside>
      <main className="admin__main">{children}</main>
    </div>
  );
};

export default AdminLayout;

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Swords,
  Package,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
  User,
} from 'lucide-react';
import { logout } from '@/lib/auth/actions';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/posts', label: 'Posts', icon: <FileText size={20} /> },
  { href: '/admin/quests', label: 'Quests', icon: <Swords size={20} /> },
  { href: '/admin/items', label: 'Items', icon: <Package size={20} /> },
  { href: '/admin/contacts', label: 'Contacts', icon: <Mail size={20} /> },
];

interface AdminSidebarProps {
  username: string;
}

export const AdminSidebar = ({ username }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__header">
        <Link href="/admin" className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-mark">CMS</span>
          {!isCollapsed && <span className="admin-sidebar__logo-text">Journal</span>}
        </Link>
        <button
          className="admin-sidebar__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar__nav-item ${isActive(item.href) ? 'admin-sidebar__nav-item--active' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="admin-sidebar__nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="admin-sidebar__nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user" title={isCollapsed ? username : undefined}>
          <User size={16} />
          {!isCollapsed && <span>{username}</span>}
        </div>
        <button
          className="admin-sidebar__action"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Logout</span>}
        </button>
        <Link
          href="/"
          className="admin-sidebar__action"
          title={isCollapsed ? 'Back to Site' : undefined}
        >
          <ArrowLeft size={16} />
          {!isCollapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
};

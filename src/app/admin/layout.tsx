import { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { AdminSidebar } from './components/AdminSidebar';
import './admin.scss';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await requireAdmin();

  return (
    <div className="admin">
      <AdminSidebar username={user.username} />
      <main className="admin__main">{children}</main>
    </div>
  );
};

export default AdminLayout;

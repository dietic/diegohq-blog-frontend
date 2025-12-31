import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDesktopIconById } from '@/lib/content';
import { EditIconForm } from './EditIconForm';

interface EditIconPageProps {
  params: Promise<{ id: string }>;
}

export const EditIconPage = async ({ params }: EditIconPageProps) => {
  const { id } = await params;
  const icon = await getDesktopIconById(id);

  if (!icon) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit Desktop Icon</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/desktop" style={{ color: '#71717a' }}>
              Desktop
            </Link>
            {' / '}
            {icon.label}
          </p>
        </div>
        <div className="page-header__actions">
          <span
            className={`badge ${icon.visible ? 'badge--success' : 'badge--muted'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            {icon.visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      <EditIconForm icon={icon} />
    </div>
  );
};

export default EditIconPage;

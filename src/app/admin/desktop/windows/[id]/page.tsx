import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWindowContent } from '@/lib/content';
import { EditWindowForm } from './EditWindowForm';

interface EditWindowPageProps {
  params: Promise<{ id: string }>;
}

export const EditWindowPage = async ({ params }: EditWindowPageProps) => {
  const { id } = await params;
  const window = await getWindowContent(id);

  if (!window) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit Window</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/desktop/windows" style={{ color: '#71717a' }}>
              Windows
            </Link>
            {' / '}
            {window.title}
          </p>
        </div>
        <div className="page-header__actions">
          <span
            style={{
              color: '#71717a',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            {window.defaultWidth} × {window.defaultHeight}
          </span>
        </div>
      </div>

      <EditWindowForm window={window} />
    </div>
  );
};

export default EditWindowPage;

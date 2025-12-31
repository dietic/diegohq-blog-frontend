import Link from 'next/link';
import { getAllWindowContents } from '@/lib/content';

export const WindowsPage = async () => {
  const windows = await getAllWindowContents();

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Desktop</h1>
          <p className="page-header__subtitle">Manage custom window content</p>
        </div>
        <div className="page-header__actions">
          <Link href="/admin/desktop/windows/new" className="btn btn--primary">
            + New Window
          </Link>
        </div>
      </div>

      <div className="tabs">
        <Link href="/admin/desktop" className="tabs__item">
          Icons
        </Link>
        <Link
          href="/admin/desktop/windows"
          className="tabs__item tabs__item--active"
        >
          Windows
        </Link>
        <Link href="/admin/desktop/settings" className="tabs__item">
          Settings
        </Link>
      </div>

      {windows.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Size</th>
              <th>Behavior</th>
              <th>Gating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {windows.map((window) => (
              <tr key={window.id}>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {window.icon && <span>{window.icon}</span>}
                    <strong>{window.title}</strong>
                  </div>
                </td>
                <td style={{ color: '#71717a', fontFamily: 'monospace' }}>
                  {window.id}
                </td>
                <td style={{ fontFamily: 'monospace', color: '#71717a' }}>
                  {window.defaultWidth} × {window.defaultHeight}
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.25rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {window.singleton && (
                      <span className="badge badge--muted">Singleton</span>
                    )}
                    {!window.closable && (
                      <span className="badge badge--warning">No Close</span>
                    )}
                    {!window.minimizable && (
                      <span className="badge badge--warning">No Minimize</span>
                    )}
                  </div>
                </td>
                <td style={{ color: '#71717a', fontSize: '0.875rem' }}>
                  {window.requiredLevel && `Level ${window.requiredLevel}`}
                  {window.requiredLevel && window.requiredItem && ' + '}
                  {window.requiredItem && window.requiredItem}
                  {!window.requiredLevel && !window.requiredItem && '—'}
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/desktop/windows/${window.id}`}
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
            <div className="empty-state__icon">📄</div>
            <h3 className="empty-state__title">No custom windows</h3>
            <p className="empty-state__description">
              Create custom window content that can be opened from desktop
              icons.
            </p>
            <Link
              href="/admin/desktop/windows/new"
              className="btn btn--primary"
            >
              Create First Window
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WindowsPage;

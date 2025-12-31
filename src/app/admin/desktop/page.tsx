import Link from 'next/link';
import Image from 'next/image';
import { getDesktopIcons, getDesktopSettings } from '@/lib/content';

export const DesktopPage = async () => {
  const [icons, settings] = await Promise.all([
    getDesktopIcons(),
    getDesktopSettings(),
  ]);

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Desktop</h1>
          <p className="page-header__subtitle">
            Manage desktop icons and windows
          </p>
        </div>
        <div className="page-header__actions">
          <Link href="/admin/desktop/icons/new" className="btn btn--primary">
            + New Icon
          </Link>
        </div>
      </div>

      <div className="tabs">
        <Link href="/admin/desktop" className="tabs__item tabs__item--active">
          Icons
        </Link>
        <Link href="/admin/desktop/windows" className="tabs__item">
          Windows
        </Link>
        <Link href="/admin/desktop/settings" className="tabs__item">
          Settings
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card__header">
          <h3 className="card__title">Grid Settings</h3>
        </div>
        <div className="card__body" style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ color: '#71717a', fontSize: '0.875rem' }}>
              Grid Size
            </span>
            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {settings.gridSize}px
            </div>
          </div>
          <div>
            <span style={{ color: '#71717a', fontSize: '0.875rem' }}>
              Icon Spacing
            </span>
            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {settings.iconSpacing}px
            </div>
          </div>
        </div>
      </div>

      {icons.length > 0 ? (
        <div className="icon-grid">
          {icons.map((icon) => (
            <Link
              key={icon.id}
              href={`/admin/desktop/icons/${icon.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="icon-card">
                <Image
                  src={icon.icon}
                  alt={icon.label}
                  width={48}
                  height={48}
                  className="icon-card__image"
                />
                <div className="icon-card__label">{icon.label}</div>
                <div className="icon-card__meta">
                  {icon.windowType}
                  {!icon.visible && ' • Hidden'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state__icon">🖥️</div>
            <h3 className="empty-state__title">No desktop icons</h3>
            <p className="empty-state__description">
              Add icons to appear on the desktop.
            </p>
            <Link href="/admin/desktop/icons/new" className="btn btn--primary">
              Add First Icon
            </Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: '#fafafa',
          }}
        >
          All Icons
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Label</th>
              <th>Window Type</th>
              <th>Position</th>
              <th>Visibility</th>
              <th>Gating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {icons.map((icon) => (
              <tr key={icon.id}>
                <td>
                  <Image
                    src={icon.icon}
                    alt={icon.label}
                    width={32}
                    height={32}
                    style={{ imageRendering: 'pixelated' }}
                  />
                </td>
                <td>
                  <strong>{icon.label}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                    {icon.id}
                  </div>
                </td>
                <td>
                  <span className="badge badge--info">{icon.windowType}</span>
                </td>
                <td style={{ fontFamily: 'monospace', color: '#71717a' }}>
                  ({icon.position.x}, {icon.position.y})
                </td>
                <td>
                  <span
                    className={`badge ${icon.visible ? 'badge--success' : 'badge--muted'}`}
                  >
                    {icon.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td style={{ color: '#71717a', fontSize: '0.875rem' }}>
                  {icon.requiredLevel && `Level ${icon.requiredLevel}`}
                  {icon.requiredLevel && icon.requiredItem && ' + '}
                  {icon.requiredItem && icon.requiredItem}
                  {!icon.requiredLevel && !icon.requiredItem && '—'}
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/desktop/icons/${icon.id}`}
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
      </div>
    </div>
  );
};

export default DesktopPage;

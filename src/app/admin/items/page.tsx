import Link from 'next/link';
import { getAllItems } from '@/lib/content';

const rarityColors: Record<string, string> = {
  common: 'badge--muted',
  uncommon: 'badge--success',
  rare: 'badge--info',
  legendary: 'badge--warning',
};

export const ItemsPage = async () => {
  const items = await getAllItems();

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Items</h1>
          <p className="page-header__subtitle">Manage collectible items</p>
        </div>
        <div className="page-header__actions">
          <Link href="/admin/items/new" className="btn btn--primary">
            + New Item
          </Link>
        </div>
      </div>

      {items.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Rarity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontSize: '1.5rem' }}>{item.icon}</td>
                <td>
                  <div>
                    <strong>{item.name}</strong>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#71717a',
                        marginTop: '0.25rem',
                      }}
                    >
                      {item.id}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${rarityColors[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </td>
                <td style={{ maxWidth: '300px', color: '#a1a1aa' }}>
                  {item.description}
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/items/${item.id}`}
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
            <div className="empty-state__icon">🎒</div>
            <h3 className="empty-state__title">No items yet</h3>
            <p className="empty-state__description">
              Create collectible items for quests and content gating.
            </p>
            <Link href="/admin/items/new" className="btn btn--primary">
              Create First Item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;

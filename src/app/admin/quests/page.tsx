import Link from 'next/link';
import { getAllQuests } from '@/lib/content';

export const QuestsPage = async () => {
  const quests = await getAllQuests();

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Quests</h1>
          <p className="page-header__subtitle">Manage interactive challenges</p>
        </div>
        <div className="page-header__actions">
          <Link href="/admin/quests/new" className="btn btn--primary">
            + New Quest
          </Link>
        </div>
      </div>

      {quests.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>XP Reward</th>
              <th>Item Reward</th>
              <th>Host Post</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quests.map((quest) => (
              <tr key={quest.id}>
                <td>
                  <div>
                    <strong>{quest.name}</strong>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#71717a',
                        marginTop: '0.25rem',
                      }}
                    >
                      {quest.id}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge--info">{quest.type}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      quest.difficulty === 'easy'
                        ? 'badge--success'
                        : quest.difficulty === 'medium'
                          ? 'badge--warning'
                          : 'badge--muted'
                    }`}
                  >
                    {quest.difficulty}
                  </span>
                </td>
                <td>{quest.xpReward} XP</td>
                <td style={{ color: quest.itemReward ? '#e4e4e7' : '#52525b' }}>
                  {quest.itemReward || '—'}
                </td>
                <td>
                  <Link
                    href={`/admin/posts/${quest.hostPostSlug}`}
                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                  >
                    {quest.hostPostSlug}
                  </Link>
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/quests/${quest.id}`}
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
            <div className="empty-state__icon">⚔️</div>
            <h3 className="empty-state__title">No quests yet</h3>
            <p className="empty-state__description">
              Create challenges for your readers to complete.
            </p>
            <Link href="/admin/quests/new" className="btn btn--primary">
              Create First Quest
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestsPage;

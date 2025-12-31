import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuestById } from '@/lib/content';
import { EditQuestForm } from './EditQuestForm';

interface EditQuestPageProps {
  params: Promise<{ id: string }>;
}

export const EditQuestPage = async ({ params }: EditQuestPageProps) => {
  const { id } = await params;
  const quest = await getQuestById(id);

  if (!quest) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit Quest</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/quests" style={{ color: '#71717a' }}>
              Quests
            </Link>
            {' / '}
            {quest.name}
          </p>
        </div>
        <div className="page-header__actions">
          <span
            className="badge badge--info"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            {quest.xpReward} XP
          </span>
        </div>
      </div>

      <EditQuestForm quest={quest} />
    </div>
  );
};

export default EditQuestPage;

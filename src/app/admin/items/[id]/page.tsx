import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItemById } from '@/lib/api/services/items';
import { EditItemForm } from './EditItemForm';

const rarityColors: Record<string, string> = {
  common: 'badge--muted',
  uncommon: 'badge--success',
  rare: 'badge--info',
  legendary: 'badge--warning',
};

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export const EditItemPage = async ({ params }: EditItemPageProps) => {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit Item</h1>
          <p className="page-header__subtitle">
            <Link href="/admin/items" style={{ color: '#71717a' }}>
              Items
            </Link>
            {' / '}
            {item.name}
          </p>
        </div>
        <div className="page-header__actions">
          <span
            className={`badge ${rarityColors[item.rarity]}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            {item.rarity}
          </span>
        </div>
      </div>

      <EditItemForm item={item} />
    </div>
  );
};

export default EditItemPage;

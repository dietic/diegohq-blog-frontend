'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { markContactAsRead, deleteContact } from '@/lib/api/services/contacts';

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkRead = async () => {
    setLoading(true);
    try {
      await markContactAsRead(id);
      router.refresh();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkRead}
      disabled={loading}
      className="btn btn--ghost btn--sm"
      title="Mark as read"
    >
      <Check size={14} />
    </button>
  );
}

export function DeleteContactButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setLoading(true);
    try {
      await deleteContact(id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn--ghost btn--sm btn--danger"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}

import Link from 'next/link';
import { ArrowLeft, Mail, Reply, Clock, User } from 'lucide-react';
import { getContactById, markContactAsRead } from '@/lib/api/services/contacts';
import type { ContactSubmissionResponse } from '@/lib/api/types';
import { ReplyForm } from './ReplyForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  let contact: ContactSubmissionResponse | null = null;

  try {
    contact = await getContactById(id);
    // Mark as read when viewed
    if (!contact.is_read) {
      await markContactAsRead(id);
    }
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    notFound();
  }

  if (!contact) {
    notFound();
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <Link
            href="/admin/contacts"
            className="btn btn--ghost btn--sm"
            style={{ marginBottom: '1rem', display: 'inline-flex' }}
          >
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Back to Messages
          </Link>
          <h1 className="page-header__title">Message from {contact.name}</h1>
          <p className="page-header__subtitle">{contact.email}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card__body">
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              color: '#71717a',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} />
              {formatDate(contact.created_at)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} />
              {contact.email}
            </span>
          </div>

          <div
            style={{
              background: '#18181b',
              padding: '1.5rem',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
            }}
          >
            {contact.message}
          </div>
        </div>
      </div>

      {contact.is_replied && contact.reply_message && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card__body">
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#22c55e',
                marginBottom: '1rem',
              }}
            >
              <Reply size={18} />
              Your Reply
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                color: '#71717a',
                fontSize: '0.875rem',
              }}
            >
              {contact.replied_at && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} />
                  {formatDate(contact.replied_at)}
                </span>
              )}
              {contact.replied_by && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} />
                  {contact.replied_by}
                </span>
              )}
            </div>
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
              }}
            >
              {contact.reply_message}
            </div>
          </div>
        </div>
      )}

      {!contact.is_replied && (
        <div className="card">
          <div className="card__body">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Reply size={18} />
              Send Reply
            </h3>
            <ReplyForm contactId={contact.id} contactEmail={contact.email} />
          </div>
        </div>
      )}
    </div>
  );
}

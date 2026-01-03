import Link from 'next/link';
import { Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { getAllContacts } from '@/lib/api/services/contacts';
import type { ContactSubmissionResponse } from '@/lib/api/types';
import { DeleteContactButton, MarkReadButton } from './ContactActions';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateMessage(message: string, maxLength: number = 100): string {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength) + '...';
}

export default async function ContactsPage() {
  let contacts: ContactSubmissionResponse[] = [];
  let unreadCount = 0;

  try {
    const response = await getAllContacts();
    contacts = response.items;
    unreadCount = response.unread_count;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
  }

  return (
    <div className="admin__content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Contact Submissions</h1>
          <p className="page-header__subtitle">
            {unreadCount > 0 ? (
              <span style={{ color: '#f59e0b' }}>
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </span>
            ) : (
              'All messages read'
            )}
          </p>
        </div>
      </div>

      {contacts.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>From</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                style={{
                  background: contact.is_read ? 'transparent' : 'rgba(245, 158, 11, 0.05)',
                }}
              >
                <td>
                  {contact.is_read ? (
                    <MailOpen size={18} style={{ color: '#71717a' }} />
                  ) : (
                    <Mail size={18} style={{ color: '#f59e0b' }} />
                  )}
                </td>
                <td>
                  <div>
                    <strong style={{ fontWeight: contact.is_read ? 'normal' : 'bold' }}>
                      {contact.name}
                    </strong>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#71717a',
                        marginTop: '0.25rem',
                      }}
                    >
                      {contact.email}
                    </div>
                  </div>
                </td>
                <td style={{ maxWidth: '300px', color: '#a1a1aa' }}>
                  {truncateMessage(contact.message)}
                </td>
                <td>
                  {contact.is_replied ? (
                    <span className="badge badge--success">
                      <Reply size={12} style={{ marginRight: '4px' }} />
                      Replied
                    </span>
                  ) : contact.is_read ? (
                    <span className="badge badge--muted">Read</span>
                  ) : (
                    <span className="badge badge--warning">New</span>
                  )}
                </td>
                <td style={{ color: '#71717a', fontSize: '0.875rem' }}>
                  {formatDate(contact.created_at)}
                </td>
                <td>
                  <div className="data-table__actions">
                    <Link
                      href={`/admin/contacts/${contact.id}`}
                      className="btn btn--ghost btn--sm"
                    >
                      View
                    </Link>
                    {!contact.is_read && (
                      <MarkReadButton id={contact.id} />
                    )}
                    <DeleteContactButton id={contact.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state__icon">
              <Mail size={48} />
            </div>
            <h3 className="empty-state__title">No messages yet</h3>
            <p className="empty-state__description">
              Contact form submissions will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

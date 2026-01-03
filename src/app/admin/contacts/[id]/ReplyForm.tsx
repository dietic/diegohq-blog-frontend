'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { replyToContact } from '@/lib/api/services/contacts';

interface ReplyFormProps {
  contactId: string;
  contactEmail: string;
}

export function ReplyForm({ contactId, contactEmail }: ReplyFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await replyToContact(contactId, { reply_message: message });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: '#71717a', marginBottom: '1rem', fontSize: '0.875rem' }}>
        This will save your reply and mark this message as replied.
        <br />
        Note: Email sending is not yet implemented - you&apos;ll need to manually send the
        email to <strong>{contactEmail}</strong>.
      </p>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <div className="form__group">
        <label htmlFor="reply" className="form__label">
          Your Reply
        </label>
        <textarea
          id="reply"
          className="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Type your reply here..."
          disabled={loading}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading || !message.trim()}
        >
          <Send size={16} style={{ marginRight: '0.5rem' }} />
          {loading ? 'Sending...' : 'Save Reply'}
        </button>
      </div>
    </form>
  );
}

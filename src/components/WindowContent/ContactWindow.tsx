'use client';

import { useState } from 'react';
import './WindowContent.scss';

export function ContactWindow() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  if (status === 'success') {
    return (
      <div className="window-content contact-window">
        <div className="contact-window__success">
          <span className="contact-window__success-icon">✓</span>
          <h3>Message Sent!</h3>
          <p>Thanks for reaching out. We&apos;ll get back to you soon.</p>
          <button
            className="contact-window__reset"
            onClick={() => setStatus('idle')}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="window-content contact-window">
      <div className="contact-window__header">
        <h2 className="contact-window__title">Contact Us</h2>
        <p className="contact-window__subtitle">
          Have a question or feedback? We&apos;d love to hear from you!
        </p>
      </div>

      <form className="contact-window__form" onSubmit={handleSubmit}>
        {error && <div className="contact-window__error">{error}</div>}

        <div className="contact-window__field">
          <label htmlFor="contact-name" className="contact-window__label">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            className="contact-window__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="contact-window__field">
          <label htmlFor="contact-email" className="contact-window__label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className="contact-window__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="contact-window__field">
          <label htmlFor="contact-message" className="contact-window__label">
            Message
          </label>
          <textarea
            id="contact-message"
            className="contact-window__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            required
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          className="contact-window__submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

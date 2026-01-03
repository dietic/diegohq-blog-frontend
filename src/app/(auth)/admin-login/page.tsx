'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdmin } from '@/lib/auth';
import './login.scss';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errorFromUrl = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);

      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {(error || errorFromUrl) && (
        <div className="admin-login__error">
          {error ||
            (errorFromUrl === 'unauthorized'
              ? 'You do not have admin access'
              : 'Please log in to continue')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-login__form">
        <div className="admin-login__field">
          <label htmlFor="email" className="admin-login__label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-login__input"
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="admin-login__field">
          <label htmlFor="password" className="admin-login__label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login__input"
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="admin-login__submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <div className="admin-login__header">
          <span className="admin-login__icon">⚙️</span>
          <h1 className="admin-login__title">Journal CMS</h1>
          <p className="admin-login__subtitle">Admin Login</p>
        </div>

        <Suspense fallback={<div className="admin-login__loading">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="admin-login__footer">
          <a href="/" className="admin-login__back">
            ← Back to Site
          </a>
        </div>
      </div>
    </div>
  );
}

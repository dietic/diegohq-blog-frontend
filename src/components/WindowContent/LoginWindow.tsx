'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWindowManager } from '@/components/Window/WindowContext';
import './WindowContent.scss';

interface LoginWindowProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginWindow({ onSuccess, onSwitchToSignup }: LoginWindowProps) {
  const { login } = useAuth();
  const { closeWindow } = useWindowManager();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      closeWindow('login');
      onSuccess?.();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="window-content auth-window">
      <div className="auth-window__header">
        <h2 className="auth-window__title">Login</h2>
        <p className="auth-window__subtitle">Welcome back, adventurer!</p>
      </div>

      <form className="auth-window__form" onSubmit={handleSubmit}>
        {error && <div className="auth-window__error">{error}</div>}

        <div className="auth-window__field">
          <label htmlFor="email" className="auth-window__label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="auth-window__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-window__field">
          <label htmlFor="password" className="auth-window__label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="auth-window__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="auth-window__submit"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-window__footer">
        <p>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="auth-window__link"
            onClick={onSwitchToSignup}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

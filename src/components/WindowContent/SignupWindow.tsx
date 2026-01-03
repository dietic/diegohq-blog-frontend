'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWindowManager } from '@/components/Window/WindowContext';
import './WindowContent.scss';

interface SignupWindowProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupWindow({ onSuccess, onSwitchToLogin }: SignupWindowProps) {
  const { register, login } = useAuth();
  const { closeWindow } = useWindowManager();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await register(username, email, password);

    if (result.success) {
      // Auto-login after successful registration
      const loginResult = await login(email, password);
      setIsLoading(false);

      if (loginResult.success) {
        closeWindow('signup');
        onSuccess?.();
      } else {
        // Registration succeeded but login failed - close signup and open login
        closeWindow('signup');
        onSwitchToLogin?.();
      }
    } else {
      setIsLoading(false);
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="window-content auth-window">
      <div className="auth-window__header">
        <h2 className="auth-window__title">Sign Up</h2>
        <p className="auth-window__subtitle">Begin your adventure!</p>
      </div>

      <form className="auth-window__form" onSubmit={handleSubmit}>
        {error && <div className="auth-window__error">{error}</div>}

        <div className="auth-window__field">
          <label htmlFor="username" className="auth-window__label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="auth-window__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="HeroName123"
            required
            minLength={3}
            maxLength={30}
            disabled={isLoading}
          />
        </div>

        <div className="auth-window__field">
          <label htmlFor="signup-email" className="auth-window__label">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="auth-window__label">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            className="auth-window__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            disabled={isLoading}
          />
        </div>

        <div className="auth-window__field">
          <label htmlFor="confirm-password" className="auth-window__label">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            className="auth-window__input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-window__footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="auth-window__link"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export function ResetProgressButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset ALL post progress for ALL users? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/game/dev/reset-post-progress', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Reset complete! ${data.deleted_count} record(s) deleted.`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to reset',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset',
      });
    } finally {
      setIsLoading(false);

      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="btn btn--danger btn--sm"
        title="Reset all post read progress for all users (dev only)"
      >
        {isLoading ? 'Resetting...' : 'Reset All Read Progress'}
      </button>
      {result && (
        <span
          style={{
            fontSize: '0.75rem',
            color: result.success ? '#34d399' : '#f87171',
          }}
        >
          {result.message}
        </span>
      )}
    </div>
  );
}

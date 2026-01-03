'use client';

import { useState, useEffect } from 'react';
import './ProfileWindow.scss';

interface UserData {
  username: string;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  avatar_url: string | null;
}

// XP required for each level (simple formula: level * 100)
function getXpForLevel(level: number): number {
  return level * 100;
}

function getXpProgress(xp: number, level: number): number {
  const currentLevelXp = getXpForLevel(level - 1);
  const nextLevelXp = getXpForLevel(level);
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  return Math.min(100, Math.max(0, (xpIntoLevel / xpNeeded) * 100));
}

export function ProfileWindow() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Not logged in');
          } else {
            setError('Failed to load profile');
          }
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="profile-window profile-window--loading">
        <div className="profile-window__loading">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-window profile-window--error">
        <div className="profile-window__error">{error || 'Not logged in'}</div>
      </div>
    );
  }

  const xpProgress = getXpProgress(user.xp, user.level);
  const xpForNextLevel = getXpForLevel(user.level);

  return (
    <div className="profile-window">
      <div className="profile-window__header">
        <div className="profile-window__avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} />
          ) : (
            <div className="profile-window__avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-window__info">
          <h2 className="profile-window__name">{user.username}</h2>
          <div className="profile-window__level">Level {user.level}</div>
        </div>
      </div>

      <div className="profile-window__stats">
        <div className="profile-window__stat">
          <div className="profile-window__stat-label">Experience</div>
          <div className="profile-window__xp-bar">
            <div
              className="profile-window__xp-fill"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="profile-window__xp-text">
            {user.xp} / {xpForNextLevel} XP
          </div>
        </div>

        <div className="profile-window__stat-row">
          <div className="profile-window__stat">
            <div className="profile-window__stat-label">Current Streak</div>
            <div className="profile-window__stat-value">
              <span className="profile-window__streak-icon">🔥</span>
              {user.current_streak} days
            </div>
          </div>

          <div className="profile-window__stat">
            <div className="profile-window__stat-label">Best Streak</div>
            <div className="profile-window__stat-value">
              <span className="profile-window__streak-icon">🏆</span>
              {user.longest_streak} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

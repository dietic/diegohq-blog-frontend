'use client';

import { useState, useEffect } from 'react';
import type { QuestProgressResponse } from '@/lib/api/types';
import './WindowContent.scss';

interface QuestLogWindowProps {
  onOpenPost?: (slug: string) => void;
  onOpenQuest?: (questId: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  code: '#8b5cf6',
  'multiple-choice': '#3b82f6',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function QuestLogWindow({ onOpenPost, onOpenQuest }: QuestLogWindowProps) {
  const [quests, setQuests] = useState<QuestProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestProgress() {
      try {
        const res = await fetch('/api/quests/progress?include_in_progress=true');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Log in to view your quest history');
          } else {
            setError('Failed to load quest history');
          }
          return;
        }
        const data = await res.json();
        setQuests(data);
      } catch (err) {
        setError('Failed to load quest history');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestProgress();
  }, []);

  const inProgressQuests = quests.filter((q) => q.inProgress);
  const completedQuests = quests.filter((q) => q.completed);
  const totalXpEarned = completedQuests.reduce((sum, q) => sum + q.xpEarned, 0);

  if (loading) {
    return (
      <div className="window-content quest-log">
        <div className="quest-log__loading">Loading quest history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="window-content quest-log">
        <div className="quest-log__empty">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="window-content quest-log">
      {/* Stats Bar */}
      <div className="quest-log__stats-bar">
        <div className="quest-log__stat-item">
          <span className="quest-log__stat-value quest-log__stat-value--progress">
            {inProgressQuests.length}
          </span>
          <span className="quest-log__stat-label">Active</span>
        </div>
        <div className="quest-log__stat-item">
          <span className="quest-log__stat-value quest-log__stat-value--completed">
            {completedQuests.length}
          </span>
          <span className="quest-log__stat-label">Completed</span>
        </div>
        <div className="quest-log__stat-item">
          <span className="quest-log__stat-value quest-log__stat-value--xp">
            {totalXpEarned}
          </span>
          <span className="quest-log__stat-label">XP Earned</span>
        </div>
      </div>

      {/* Content */}
      <div className="quest-log__content">
        {quests.length === 0 ? (
          <div className="quest-log__empty">
            <div className="quest-log__empty-icon">&#9733;</div>
            <p>No quests yet</p>
            <p className="quest-log__empty-hint">
              Complete quests in journal entries to track your progress!
            </p>
          </div>
        ) : (
          <>
            {/* In Progress Section */}
            {inProgressQuests.length > 0 && (
              <div className="quest-log__section">
                <h3 className="quest-log__section-title">Active Quests</h3>
                <div className="quest-log__list">
                  {inProgressQuests.map((quest) => (
                    <div
                      key={quest.questId}
                      className="quest-log__card quest-log__card--active"
                      onClick={() => onOpenQuest?.(quest.questId)}
                    >
                      <div className="quest-log__card-main">
                        <div className="quest-log__card-info">
                          <span
                            className="quest-log__card-type"
                            style={{ backgroundColor: TYPE_COLORS[quest.questType] || '#8b5cf6' }}
                          >
                            {quest.questType === 'code' ? 'Code' : 'Quiz'}
                          </span>
                          <h4 className="quest-log__card-name">{quest.questName}</h4>
                        </div>
                        <div className="quest-log__card-reward">
                          <span className="quest-log__card-xp">{quest.xpReward} XP</span>
                        </div>
                      </div>
                      <div className="quest-log__card-footer">
                        <span className="quest-log__card-date">
                          Started {formatDate(quest.startedAt)}
                        </span>
                        <span className="quest-log__card-action">
                          Continue &#8250;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Section */}
            {completedQuests.length > 0 && (
              <div className="quest-log__section">
                <h3 className="quest-log__section-title">Completed</h3>
                <div className="quest-log__list">
                  {completedQuests.map((quest) => (
                    <div
                      key={quest.questId}
                      className="quest-log__card quest-log__card--completed"
                    >
                      <div className="quest-log__card-main">
                        <div className="quest-log__card-info">
                          <span className="quest-log__card-check">&#10003;</span>
                          <h4 className="quest-log__card-name">{quest.questName}</h4>
                        </div>
                        <div className="quest-log__card-reward">
                          <span className="quest-log__card-xp quest-log__card-xp--earned">
                            +{quest.xpEarned} XP
                          </span>
                        </div>
                      </div>
                      <div className="quest-log__card-footer">
                        <span className="quest-log__card-date">
                          {formatDate(quest.completedAt)} at {formatTime(quest.completedAt)}
                        </span>
                        {quest.hostPostTitle && (
                          <button
                            className="quest-log__card-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPost?.(quest.hostPostSlug);
                            }}
                          >
                            View Post
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

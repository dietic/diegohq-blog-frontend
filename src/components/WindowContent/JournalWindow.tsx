'use client';

import { useState, useEffect } from 'react';
import type { PostSummaryResponse } from '@/lib/api/types';
import './WindowContent.scss';

interface JournalWindowProps {
  posts: PostSummaryResponse[];
  onOpenPost?: (slug: string) => void;
}

const pillarLabels: Record<string, string> = {
  programming: 'Programming',
  'growth-career': 'Growth & Career',
  'saas-journey': 'SaaS Journey',
};

const levelColors: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

export function JournalWindow({ posts, onOpenPost }: JournalWindowProps) {
  const [filter, setFilter] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((p) => p.content_pillar === filter));
    }
  }, [filter, posts]);

  return (
    <div className="window-content journal">
      <div className="journal__header">
        <h2 className="journal__title">Journal Entries</h2>
        <div className="journal__filters">
          <button
            className={`journal__filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {Object.entries(pillarLabels).map(([key, label]) => (
            <button
              key={key}
              className={`journal__filter ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="journal__list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="journal__entry"
              onClick={() => onOpenPost?.(post.slug)}
            >
              <div className="journal__entry-header">
                <span className="journal__entry-title">{post.title}</span>
                <span
                  className="journal__entry-level"
                  style={{ color: levelColors[post.target_level] || '#888' }}
                >
                  {post.target_level}
                </span>
              </div>
              <p className="journal__entry-excerpt">{post.excerpt}</p>
              <div className="journal__entry-meta">
                <span className="journal__entry-pillar">
                  {pillarLabels[post.content_pillar] || post.content_pillar}
                </span>
                <span className="journal__entry-xp">+{post.read_xp} XP</span>
                <span className="journal__entry-time">
                  {post.reading_time} min read
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="journal__empty">
            <p>No journal entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

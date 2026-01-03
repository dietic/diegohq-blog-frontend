'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { PostResponse, ReadPostResponse } from '@/lib/api/types';
import { useMDXCompiler } from '@/components/mdx/useMDXCompiler';
import { MDXErrorBoundary } from '@/components/mdx/MDXErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import './WindowContent.scss';

interface PostWindowProps {
  post: PostResponse;
  onOpenWindow?: (id: string) => void;
  registerCloseHandler?: (handler: () => boolean) => void;
  onForceClose?: () => void;
}

export function PostWindow({ post, onOpenWindow, registerCloseHandler, onForceClose }: PostWindowProps) {
  const { Content, error, isCompiling } = useMDXCompiler(post.content);
  const { isAuthenticated, updateUserStats } = useAuth();
  const [showGuestWarning, setShowGuestWarning] = useState(!isAuthenticated);
  const [isXpClaimed, setIsXpClaimed] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(post.read_xp);
  const hasCheckedStatus = useRef(false);

  // Check if post was already read on mount
  useEffect(() => {
    if (!isAuthenticated || hasCheckedStatus.current) return;
    hasCheckedStatus.current = true;

    const checkReadStatus = async () => {
      try {
        const response = await fetch(`/api/game/post-status?slug=${encodeURIComponent(post.slug)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.has_read) {
            setIsXpClaimed(true);
            setXpAwarded(0); // Already claimed, no XP awarded this time
          }
        }
      } catch (err) {
        console.error('Failed to check post read status:', err);
      }
    };

    checkReadStatus();
  }, [isAuthenticated, post.slug]);

  const handleGuestContinue = () => {
    setShowGuestWarning(false);
  };

  const handleGuestLogin = () => {
    setShowGuestWarning(false);
    onOpenWindow?.('login');
  };

  const handleClaimXp = async () => {
    if (isClaimLoading || isXpClaimed) return;

    setIsClaimLoading(true);
    try {
      const response = await fetch('/api/game/read-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_slug: post.slug }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim XP');
      }

      const data: ReadPostResponse = await response.json();

      setIsXpClaimed(true);
      setXpAwarded(data.xp_awarded);

      // Update user stats in context
      updateUserStats(data.new_xp, data.new_level);

      // Show toast only if XP was actually awarded (not already claimed)
      if (data.xp_awarded > 0) {
        setShowXpToast(true);
        setTimeout(() => setShowXpToast(false), 3000);
      }
    } catch (err) {
      console.error('Failed to claim XP:', err);
      // Still mark as claimed locally to avoid blocking the user
      setIsXpClaimed(true);
    } finally {
      setIsClaimLoading(false);
    }
  };

  // Handle close attempt - returns true if can close, false to prevent
  const handleCloseAttempt = useCallback(() => {
    if (isAuthenticated && !isXpClaimed) {
      setShowCloseWarning(true);
      return false; // Prevent close
    }
    return true; // Allow close
  }, [isAuthenticated, isXpClaimed]);

  // Register close handler with parent
  useEffect(() => {
    registerCloseHandler?.(handleCloseAttempt);
  }, [registerCloseHandler, handleCloseAttempt]);

  const handleCloseWithoutXp = () => {
    setShowCloseWarning(false);
    onForceClose?.();
  };

  const handleStayAndClaim = () => {
    setShowCloseWarning(false);
    // Just close the dialog - user will scroll down to claim
  };

  return (
    <div className="window-content post">
      {/* XP Toast */}
      {showXpToast && (
        <div className="xp-toast">
          <div className="xp-toast__icon">
            <Image
              src="/desktop-icons/chest.png"
              alt="XP"
              width={32}
              height={32}
            />
          </div>
          <div className="xp-toast__content">
            <span className="xp-toast__title">XP Claimed!</span>
            <span className="xp-toast__amount">+{xpAwarded} XP</span>
          </div>
        </div>
      )}

      {/* Close Warning Dialog */}
      {showCloseWarning && (
        <div className="post-dialog__overlay">
          <div className="post-dialog">
            <div className="post-dialog__header">
              <Image
                src="/desktop-icons/chest.png"
                alt="XP"
                width={24}
                height={24}
              />
              <span className="post-dialog__title">Unclaimed XP</span>
            </div>

            <div className="post-dialog__content">
              <div className="post-dialog__icon">
                <Image
                  src="/desktop-icons/chest.png"
                  alt="XP"
                  width={48}
                  height={48}
                />
              </div>

              <div className="post-dialog__message">
                <p>You haven&apos;t claimed your XP yet!</p>
                <p className="post-dialog__xp">
                  <span className="post-dialog__xp-amount">+{post.read_xp} XP</span> waiting for you
                </p>
              </div>
            </div>

            <div className="post-dialog__actions">
              <button
                className="post-dialog__btn post-dialog__btn--cancel"
                onClick={handleCloseWithoutXp}
              >
                Leave without XP
              </button>
              <button
                className="post-dialog__btn post-dialog__btn--confirm"
                onClick={handleStayAndClaim}
              >
                Stay & Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Warning Alert */}
      {showGuestWarning && (
        <div className="post__alert post__alert--warning">
          <div className="post__alert-content">
            <p>
              You&apos;re not logged in. Reading this post without an account means
              you&apos;ll miss out on <strong>+{post.read_xp} XP</strong>!
            </p>
            <div className="post__alert-actions">
              <button
                className="post__alert-btn post__alert-btn--primary"
                onClick={handleGuestLogin}
              >
                Log In
              </button>
              <button
                className="post__alert-btn post__alert-btn--secondary"
                onClick={handleGuestContinue}
              >
                Continue Without XP
              </button>
            </div>
          </div>
        </div>
      )}

      <article className="post__article">
        <header className="post__header">
          <div className="post__meta">
            <span className="post__pillar">{post.content_pillar}</span>
            <span className="post__level">{post.target_level}</span>
            <span className="post__xp">+{post.read_xp} XP</span>
          </div>
          <h1 className="post__title">{post.title}</h1>
          <p className="post__excerpt">{post.excerpt}</p>
          <div className="post__info">
            <span>By {post.author}</span>
            <span>{post.reading_time} min read</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="post__content">
          <div className="post__body">
            {isCompiling ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: '#f87171' }}>Error rendering content</p>
            ) : Content ? (
              <MDXErrorBoundary>
                <Content />
              </MDXErrorBoundary>
            ) : null}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <footer className="post__footer">
            <div className="post__tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post__tag">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Claim XP - Only for authenticated users */}
        {isAuthenticated && (
          <div className="post__read-action">
            {isXpClaimed ? (
              <div className="post__read-success">
                <Image
                  src="/desktop-icons/chest.png"
                  alt="XP"
                  width={20}
                  height={20}
                />
                {xpAwarded > 0 ? `+${xpAwarded} XP claimed!` : 'Already claimed!'}
              </div>
            ) : (
              <button
                className="post__claim-btn"
                onClick={handleClaimXp}
                disabled={isClaimLoading}
              >
                <Image
                  src="/desktop-icons/chest.png"
                  alt="XP"
                  width={24}
                  height={24}
                />
                {isClaimLoading ? 'Claiming...' : `Claim +${post.read_xp} XP`}
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

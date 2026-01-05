'use client';

import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type { QuestResponse, CodeSubmitResponse, QuestSubmitResponse } from '@/lib/api/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import './WindowContent.scss';

interface QuestWindowProps {
  quest: QuestResponse;
  onComplete?: () => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  html: 'html',
  css: 'css',
  jsx: 'javascript',
  tsx: 'typescript',
};

const TYPE_COLORS: Record<string, string> = {
  code: '#8b5cf6',
  'multiple-choice': '#3b82f6',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

export function QuestWindow({ quest, onComplete }: QuestWindowProps) {
  const { isAuthenticated, updateUserStats } = useAuth();
  const { showXPToast, showLevelUpToast } = useToast();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [code, setCode] = useState(quest.starter_code || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState<string | null>(quest.hint);
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Start quest when component mounts
  useEffect(() => {
    if (!isAuthenticated) return;

    const startQuest = async () => {
      try {
        const response = await fetch(`/api/quests/${quest.quest_id}/start`, {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          setHasStarted(true);
          if (data.alreadyCompleted) {
            setIsCompleted(true);
          }
        }
      } catch (error) {
        console.error('Failed to start quest:', error);
      }
    };

    startQuest();
  }, [isAuthenticated, quest.quest_id]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleMultipleChoiceSubmit = useCallback(async () => {
    if (!selectedAnswer || isSubmitting || isCompleted) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/quests/${quest.quest_id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: selectedAnswer }),
      });

      if (!response.ok) {
        const error = await response.json();
        setFeedback(error.error || 'Failed to submit answer');
        setIsCorrect(false);
        return;
      }

      const data: QuestSubmitResponse = await response.json();

      setAttempts(data.attempts);
      setIsCorrect(data.correct);
      setFeedback(data.feedback || (data.correct ? 'Correct!' : 'Incorrect. Try again!'));

      if (data.correct) {
        setIsCompleted(true);
        updateUserStats(data.newXp, data.newLevel);

        if (data.xpAwarded > 0) {
          showXPToast(data.xpAwarded);
        }
        if (data.leveledUp) {
          showLevelUpToast(data.newLevel);
        }

        onComplete?.();
      }
    } catch (error) {
      setFeedback('Failed to submit answer');
      setIsCorrect(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAnswer, isSubmitting, isCompleted, quest.quest_id, updateUserStats, showXPToast, showLevelUpToast, onComplete]);

  const handleCodeSubmit = useCallback(async () => {
    if (!code.trim() || isSubmitting || isCompleted || cooldown > 0) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/quests/${quest.quest_id}/submit-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        setFeedback(error.error || 'Failed to submit code');
        setIsCorrect(false);
        return;
      }

      const data: CodeSubmitResponse = await response.json();

      setAttempts(data.attempts);
      setIsCorrect(data.passed);
      setFeedback(data.feedback);
      setCooldown(data.cooldownSeconds);

      if (data.showHint && data.hint) {
        setShowHint(true);
        setHint(data.hint);
      }

      if (data.passed) {
        setIsCompleted(true);
        updateUserStats(data.newXp, data.newLevel);

        if (data.xpAwarded > 0) {
          showXPToast(data.xpAwarded);
        }
        if (data.leveledUp) {
          showLevelUpToast(data.newLevel);
        }

        onComplete?.();
      }
    } catch (error) {
      setFeedback('Failed to submit code');
      setIsCorrect(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isSubmitting, isCompleted, cooldown, quest.quest_id, updateUserStats, showXPToast, showLevelUpToast, onComplete]);

  if (!isAuthenticated) {
    return (
      <div className="window-content quest">
        <div className="quest__header">
          <h2 className="quest__title">{quest.name}</h2>
        </div>
        <div className="quest__auth-required">
          <p>You need to be logged in to attempt quests.</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="window-content quest">
        <div className="quest__header">
          <h2 className="quest__title">{quest.name}</h2>
          <span className="quest__completed-badge">Completed</span>
        </div>
        <div className="quest__success">
          <div className="quest__success-icon">&#10003;</div>
          <h3>Quest Completed!</h3>
          <p>You earned +{quest.xp_reward} XP</p>
        </div>
      </div>
    );
  }

  const isCodeQuest = quest.quest_type === 'code';
  const monacoLanguage = LANGUAGE_MAP[quest.language || 'javascript'] || 'javascript';

  return (
    <div className="window-content quest">
      <div className="quest__header">
        <div className="quest__header-main">
          <h2 className="quest__title">{quest.name}</h2>
          <span className="quest__xp">+{quest.xp_reward} XP</span>
        </div>
        <div className="quest__meta">
          <span
            className="quest__type"
            style={{ backgroundColor: TYPE_COLORS[quest.quest_type] || '#8b5cf6' }}
          >
            {isCodeQuest ? 'Code Quest' : 'Multiple Choice'}
          </span>
          <span
            className="quest__difficulty"
            style={{
              borderColor: DIFFICULTY_COLORS[quest.difficulty] || '#22c55e',
              color: DIFFICULTY_COLORS[quest.difficulty] || '#22c55e',
            }}
          >
            {quest.difficulty}
          </span>
          {attempts > 0 && <span className="quest__attempts">{attempts} attempt{attempts !== 1 ? 's' : ''}</span>}
        </div>
      </div>

      <div className="quest__description">{quest.description}</div>

      <div className="quest__prompt">{quest.prompt}</div>

      {isCodeQuest ? (
        <div className="quest__code-area">
          <div className="quest__editor-container">
            <Editor
              height="300px"
              language={monacoLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                readOnly: isCompleted,
              }}
            />
          </div>

          {showHint && hint && (
            <div className="quest__hint">
              <span className="quest__hint-label">Hint:</span>
              <span className="quest__hint-text">{hint}</span>
            </div>
          )}

          {feedback && (
            <div className={`quest__feedback ${isCorrect ? 'quest__feedback--success' : 'quest__feedback--error'}`}>
              {feedback}
            </div>
          )}

          <div className="quest__actions">
            <button
              className="quest__submit"
              onClick={handleCodeSubmit}
              disabled={isSubmitting || !code.trim() || cooldown > 0}
            >
              {isSubmitting
                ? 'Submitting...'
                : cooldown > 0
                  ? `Wait ${cooldown}s`
                  : 'Submit Code'}
            </button>
          </div>
        </div>
      ) : (
        <div className="quest__multiple-choice">
          <div className="quest__options">
            {quest.options?.map((option, index) => (
              <button
                key={index}
                className={`quest__option ${selectedAnswer === option ? 'quest__option--selected' : ''}`}
                onClick={() => !isCompleted && setSelectedAnswer(option)}
                disabled={isCompleted}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`quest__feedback ${isCorrect ? 'quest__feedback--success' : 'quest__feedback--error'}`}>
              {feedback}
            </div>
          )}

          <div className="quest__actions">
            <button
              className="quest__submit"
              onClick={handleMultipleChoiceSubmit}
              disabled={isSubmitting || !selectedAnswer}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

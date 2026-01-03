'use client';

import { useState } from 'react';
import type { QuestResponse } from '@/lib/api/types';
import './WindowContent.scss';

interface QuestLogWindowProps {
  quests: QuestResponse[];
}

const difficultyColors: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

export function QuestLogWindow({ quests }: QuestLogWindowProps) {
  const [selectedQuest, setSelectedQuest] = useState<QuestResponse | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleSubmit = () => {
    if (!selectedQuest) return;

    if (selectedQuest.correct_answer) {
      const isCorrect =
        answer.toLowerCase().trim() ===
        selectedQuest.correct_answer.toLowerCase().trim();
      setResult(isCorrect ? 'correct' : 'incorrect');
    } else {
      // Call-to-action quests are always "correct"
      setResult('correct');
    }
  };

  const handleSelectQuest = (quest: QuestResponse) => {
    setSelectedQuest(quest);
    setAnswer('');
    setResult(null);
  };

  return (
    <div className="window-content quest-log">
      <div className="quest-log__header">
        <h2 className="quest-log__title">Quest Log</h2>
      </div>

      <div className={`quest-log__container ${selectedQuest ? 'quest-log__container--with-details' : ''}`}>
        <div className="quest-log__list">
          {quests.length > 0 ? (
            quests.map((quest) => (
              <div
                key={quest.quest_id}
                className={`quest-log__item ${selectedQuest?.quest_id === quest.quest_id ? 'selected' : ''}`}
                onClick={() => handleSelectQuest(quest)}
              >
                <div className="quest-log__item-header">
                  <span className="quest-log__item-name">{quest.name}</span>
                  <span
                    className="quest-log__item-difficulty"
                    style={{ color: difficultyColors[quest.difficulty] }}
                  >
                    {quest.difficulty}
                  </span>
                </div>
                <div className="quest-log__item-meta">
                  <span className="quest-log__item-type">{quest.quest_type}</span>
                  <span className="quest-log__item-xp">+{quest.xp_reward} XP</span>
                </div>
              </div>
            ))
          ) : (
            <div className="quest-log__empty">
              <p>No quests available.</p>
            </div>
          )}
        </div>

        {selectedQuest && (
          <div className="quest-log__details">
            <h3 className="quest-log__details-name">{selectedQuest.name}</h3>
            <p className="quest-log__details-desc">{selectedQuest.description}</p>

            <div className="quest-log__prompt">
              <p>{selectedQuest.prompt}</p>
            </div>

            {selectedQuest.quest_type === 'multiple-choice' &&
              selectedQuest.options && (
                <div className="quest-log__options">
                  {selectedQuest.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={`quest-log__option ${answer === option ? 'selected' : ''}`}
                      onClick={() => setAnswer(option)}
                      disabled={result !== null}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

            {selectedQuest.quest_type === 'text-input' && (
              <input
                type="text"
                className="quest-log__input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                disabled={result !== null}
              />
            )}

            {result && (
              <div
                className={`quest-log__result ${result === 'correct' ? 'success' : 'error'}`}
              >
                {result === 'correct' ? (
                  <>
                    <span>Quest Complete!</span>
                    <span>+{selectedQuest.xp_reward} XP</span>
                    {selectedQuest.item_reward && (
                      <span>Received: {selectedQuest.item_reward}</span>
                    )}
                  </>
                ) : (
                  <span>Incorrect. Try again!</span>
                )}
              </div>
            )}

            {result !== 'correct' && (
              <button
                className="quest-log__submit"
                onClick={handleSubmit}
                disabled={
                  !answer && selectedQuest.quest_type !== 'call-to-action'
                }
              >
                {selectedQuest.quest_type === 'call-to-action'
                  ? 'Complete Quest'
                  : 'Submit Answer'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

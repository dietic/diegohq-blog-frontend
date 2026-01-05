'use client';

import { useState, useEffect, useRef } from 'react';
import type { QuestResponse } from '@/lib/api/types';
import { getAllQuests } from '@/lib/api/services/quests';

interface QuestSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const QuestSelect = ({ value, onChange }: QuestSelectProps) => {
  const [quests, setQuests] = useState<QuestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await getAllQuests();
        setQuests(data);
      } catch (err) {
        console.error('Failed to fetch quests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedQuest = quests.find((q) => q.quest_id === value);
  const filteredQuests = quests.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.quest_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (questId: string) => {
    onChange(questId);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('');
    setSearch('');
  };

  if (loading) {
    return (
      <div className="input" style={{ color: '#71717a' }}>
        Loading quests...
      </div>
    );
  }

  return (
    <div className="quest-select" ref={containerRef} style={{ position: 'relative' }}>
      <div
        className="input quest-select__trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: selectedQuest ? '#e4e4e7' : '#71717a' }}>
          {selectedQuest ? `${selectedQuest.name} (${selectedQuest.quest_id})` : 'Select a quest...'}
        </span>
        <span style={{ display: 'flex', gap: '0.5rem' }}>
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 0,
              }}
            >
              ×
            </button>
          )}
          <span style={{ color: '#71717a' }}>▼</span>
        </span>
      </div>

      {isOpen && (
        <div
          className="quest-select__dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '0.375rem',
            marginTop: '0.25rem',
            zIndex: 50,
            maxHeight: '300px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input
            type="text"
            className="input"
            placeholder="Search quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            style={{
              borderRadius: 0,
              borderBottom: '1px solid #3f3f46',
            }}
          />
          <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
            <div
              className="quest-select__option"
              onClick={() => handleSelect('')}
              style={{
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                color: '#71717a',
                fontStyle: 'italic',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              No quest
            </div>
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest) => (
                <div
                  key={quest.quest_id}
                  className="quest-select__option"
                  onClick={() => handleSelect(quest.quest_id)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    backgroundColor: quest.quest_id === value ? '#27272a' : 'transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      quest.quest_id === value ? '#27272a' : 'transparent')
                  }
                >
                  <div style={{ fontWeight: 500 }}>{quest.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                    {quest.quest_id} • {quest.quest_type} • {quest.xp_reward} XP
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '0.5rem 0.75rem', color: '#71717a' }}>
                No quests found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

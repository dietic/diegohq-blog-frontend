'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import './Toast.scss';

// Toast types
type ToastType = 'xp' | 'level-up';

interface BaseToast {
  id: string;
  type: ToastType;
}

interface XPToast extends BaseToast {
  type: 'xp';
  amount: number;
  title?: string;
}

interface LevelUpToast extends BaseToast {
  type: 'level-up';
  newLevel: number;
}

type Toast = XPToast | LevelUpToast;

interface ToastContextType {
  showXPToast: (amount: number, title?: string) => void;
  showLevelUpToast: (newLevel: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast, duration = 3000) => {
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, duration);
  }, []);

  const showXPToast = useCallback((amount: number, title?: string) => {
    const toast: XPToast = {
      id: `xp-${Date.now()}-${Math.random()}`,
      type: 'xp',
      amount,
      title,
    };
    addToast(toast);
  }, [addToast]);

  const showLevelUpToast = useCallback((newLevel: number) => {
    const toast: LevelUpToast = {
      id: `level-${Date.now()}-${Math.random()}`,
      type: 'level-up',
      newLevel,
    };
    // Level up toast stays longer
    addToast(toast, 5000);
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showXPToast, showLevelUpToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          switch (toast.type) {
            case 'xp':
              return (
                <XPToastComponent
                  key={toast.id}
                  amount={toast.amount}
                  title={toast.title}
                  onClose={() => removeToast(toast.id)}
                />
              );
            case 'level-up':
              return (
                <LevelUpToastComponent
                  key={toast.id}
                  newLevel={toast.newLevel}
                  onClose={() => removeToast(toast.id)}
                />
              );
          }
        })}
      </div>
    </ToastContext.Provider>
  );
}

interface XPToastComponentProps {
  amount: number;
  title?: string;
  onClose: () => void;
}

function XPToastComponent({ amount, title = 'XP Claimed!', onClose }: XPToastComponentProps) {
  return (
    <div className="toast toast--xp" onClick={onClose}>
      <div className="toast__icon">
        <Image
          src="/desktop-icons/xp.png"
          alt="XP"
          width={32}
          height={32}
        />
      </div>
      <div className="toast__content">
        <span className="toast__title">{title}</span>
        <span className="toast__value toast__value--xp">+{amount} XP</span>
      </div>
    </div>
  );
}

interface LevelUpToastComponentProps {
  newLevel: number;
  onClose: () => void;
}

function LevelUpToastComponent({ newLevel, onClose }: LevelUpToastComponentProps) {
  return (
    <div className="toast toast--level-up" onClick={onClose}>
      <div className="toast__icon">
        <Image
          src="/desktop-icons/sword.png"
          alt="Level Up"
          width={32}
          height={32}
        />
      </div>
      <div className="toast__content">
        <span className="toast__title">Level Up!</span>
        <span className="toast__value toast__value--level">Level {newLevel}</span>
      </div>
    </div>
  );
}

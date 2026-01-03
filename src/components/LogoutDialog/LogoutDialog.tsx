'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import './LogoutDialog.scss';

interface LogoutDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onLogout: () => void;
}

export function LogoutDialog({ isOpen, onCancel, onLogout }: LogoutDialogProps) {
  const [countdown, setCountdown] = useState(10);

  const handleLogoutNow = useCallback(() => {
    onLogout();
  }, [onLogout]);

  const handleCancel = useCallback(() => {
    setCountdown(10);
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      return;
    }

    if (countdown === 0) {
      onLogout();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, onLogout]);

  if (!isOpen) return null;

  return (
    <div className="logout-dialog__overlay">
      <div className="logout-dialog">
        <div className="logout-dialog__header">
          <Image
            src="/desktop-icons/turnoff.png"
            alt="Logout"
            width={24}
            height={24}
          />
          <span className="logout-dialog__title">End Session</span>
        </div>

        <div className="logout-dialog__content">
          <div className="logout-dialog__icon">
            <Image
              src="/desktop-icons/turnoff.png"
              alt="Logout"
              width={48}
              height={48}
            />
          </div>

          <div className="logout-dialog__message">
            <p>Are you sure you want to log out?</p>
            <p className="logout-dialog__countdown">
              Logging out in <span className="logout-dialog__timer">{countdown}</span> seconds...
            </p>
          </div>
        </div>

        <div className="logout-dialog__actions">
          <button
            className="logout-dialog__btn logout-dialog__btn--cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="logout-dialog__btn logout-dialog__btn--confirm"
            onClick={handleLogoutNow}
          >
            Log out now
          </button>
        </div>
      </div>
    </div>
  );
}

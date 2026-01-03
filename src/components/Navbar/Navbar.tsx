'use client';
import { useEffect, useState, useSyncExternalStore, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWindowManager } from '../Window/WindowContext';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutDialog } from '../LogoutDialog';
import './Navbar.scss';

// Windows that require authentication
const AUTH_WINDOW_IDS = ['journal', 'inventory', 'quests', 'profile'];

const emptySubscribe = () => () => {};

export default function Navbar() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { logout, isAuthenticated } = useAuth();
  const {
    openWindows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    minimizeAllWindows,
    closeWindow,
  } = useWindowManager();

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  const handleTaskClick = (winId: string) => {
    const win = openWindows.find((w) => w.id === winId);
    if (activeWindowId === winId && !win?.isMinimized) {
      minimizeWindow(winId);
    } else {
      focusWindow(winId);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const handleLogoutConfirm = useCallback(async () => {
    // Close windows that require authentication
    AUTH_WINDOW_IDS.forEach((id) => {
      closeWindow(id);
    });

    // Also close any post windows
    openWindows.forEach((win) => {
      if (win.id.startsWith('post-')) {
        closeWindow(win.id);
      }
    });

    // Perform logout
    await logout();

    // Close dialog and refresh
    setShowLogoutDialog(false);
    router.refresh();
  }, [closeWindow, openWindows, logout, router]);

  return (
    <>
      <div className="hq-navbar">
        <div className="hq-navbar__start">
          <button className="hq-navbar__start-btn" onClick={minimizeAllWindows}>
            <Image
              src="/logo-journal.png"
              alt="Journal Logo"
              height={20}
              width={20}
              className="hq-navbar__logo-img"
            />
            <span className="hq-navbar__start-text">Start</span>
          </button>
        </div>

        <div className="hq-navbar__tasks">
          {openWindows.map((win) => (
            <button
              key={win.id}
              className={`hq-navbar__task-item ${
                activeWindowId === win.id && !win.isMinimized
                  ? 'hq-navbar__task-item--active'
                  : ''
              }`}
              onClick={() => handleTaskClick(win.id)}
            >
              {win.icon && (
                <Image
                  src={win.icon}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-2"
                />
              )}
              <span className="hq-navbar__task-text">{win.title}</span>
            </button>
          ))}
        </div>

        <div className="hq-navbar__tray">
          <div className="hq-navbar__tray-date" suppressHydrationWarning>
            {mounted && currentTime.toLocaleDateString(undefined, dateOptions)}
          </div>
          <div className="hq-navbar__tray-time" suppressHydrationWarning>
            {mounted && (
              <>
                {hours}:{minutes < 10 ? '0' : ''}
                {minutes}
              </>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <button
            className="hq-navbar__logout-btn"
            onClick={handleLogoutClick}
            title="Log out"
          >
            <Image
              src="/desktop-icons/turnoff.png"
              alt="Log out"
              height={20}
              width={20}
            />
          </button>
        )}
      </div>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onCancel={handleLogoutCancel}
        onLogout={handleLogoutConfirm}
      />
    </>
  );
}

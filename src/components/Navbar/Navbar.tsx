'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useWindowManager } from '../Window/WindowContext';
import './Navbar.scss';

const emptySubscribe = () => () => {};

export default function Navbar() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const {
    openWindows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    minimizeAllWindows,
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
    // If clicking the active window (that is NOT minimized), minimize it.
    // Otherwise (if inactive OR minimized), focus/restore it.
    const win = openWindows.find((w) => w.id === winId);
    if (activeWindowId === winId && !win?.isMinimized) {
      minimizeWindow(winId);
    } else {
      focusWindow(winId);
    }
  };

  return (
    <div className="hq-navbar">
      {/* 1. Start Button Area */}
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

      {/* 2. Open Windows List */}
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

      {/* 3. System Tray (Clock) */}
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
    </div>
  );
}

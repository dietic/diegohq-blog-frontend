'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface WindowInstance {
  id: string;
  title: string;
  component: ReactNode;
  icon?: string;
  isMinimized?: boolean;
  isMaximized?: boolean;
}

interface WindowContextType {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  openWindow: (window: WindowInstance) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
}

const WindowContext = createContext<WindowContextType>({
  openWindows: [],
  activeWindowId: null,
  openWindow: () => {},
  closeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
});

export const WindowContextProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((window: WindowInstance) => {
    setOpenWindows((prev) => {
      // Check if already open
      const exists = prev.find((w) => w.id === window.id);
      if (exists) {
        // Just focus it if it exists
        return prev.map(w => w.id === window.id ? { ...w, isMinimized: false } : w);
      }
      return [...prev, { ...window, isMinimized: false }];
    });
    setActiveWindowId(window.id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      return remaining;
    });
    // If we closed the active window, try to focus the next one
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  return (
    <WindowContext.Provider
      value={{
        openWindows,
        activeWindowId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export function useWindowManager() {
  return useContext(WindowContext);
}
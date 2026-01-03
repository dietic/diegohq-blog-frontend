'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

export interface WindowInstance {
  id: string;
  title: string;
  component: ReactNode;
  icon?: string;
  isMinimized?: boolean;
  isMaximized?: boolean;
  initialMaximized?: boolean;
}

interface WindowContextType {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  openWindow: (window: WindowInstance) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  minimizeAllWindows: () => void;
}

const WindowContext = createContext<WindowContextType>({
  openWindows: [],
  activeWindowId: null,
  openWindow: () => {},
  closeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
  minimizeAllWindows: () => {},
});

export const WindowContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((window: WindowInstance) => {
    setOpenWindows((prev) => {
      const exists = prev.find((w) => w.id === window.id);
      if (exists) {
        return prev.map((w) =>
          w.id === window.id ? { ...w, isMinimized: false } : w
        );
      }
      return [...prev, { ...window, isMinimized: false }];
    });
    setActiveWindowId(window.id);
  }, []);

  const closeWindow = useCallback(
    (id: string) => {
      setOpenWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        return remaining;
      });
      if (activeWindowId === id) {
        setActiveWindowId(null);
      }
    },
    [activeWindowId]
  );

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
  }, []);

  const minimizeWindow = useCallback(
    (id: string) => {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      );
      if (activeWindowId === id) {
        setActiveWindowId(null);
      }
    },
    [activeWindowId]
  );

  const minimizeAllWindows = useCallback(() => {
    setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
  }, []);

  return (
    <WindowContext.Provider
      value={{
        openWindows,
        activeWindowId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        minimizeAllWindows,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export function useWindowManager() {
  return useContext(WindowContext);
}

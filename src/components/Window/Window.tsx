'use client';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import './Window.scss';
import { WindowHeader } from './WindowHeader/WindowHeader';

export interface WindowProps {
  isOpen?: boolean;
  showWindowActions?: boolean;
  windowTitle: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  style?: React.CSSProperties;
  onMouseDown?: () => void;
}

export const Window = ({
  isOpen = false,
  showWindowActions = true,
  windowTitle,
  children,
  onClose,
  onMinimize,
  style,
  onMouseDown,
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(!isOpen);

  const [windowState, setWindowState] = useState({
    x: 100,
    y: 50,
    width: 500,
    height: 600,
  });

  // Store the state before maximizing to restore it later
  const [preMaximizedState, setPreMaximizedState] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setViewportSize({ width: newWidth, height: newHeight });
      
      // If maximized, update the window size to match viewport
      if (isMaximized) {
        setWindowState(prev => ({ ...prev, width: newWidth, height: newHeight }));
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isMaximized]); // Re-bind/check when isMaximized changes to ensure sync

  const handleClose = () => {
    setIsClosed(true);
    if (onClose) onClose();
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(!isMinimized);
      if (!isMinimized && isMaximized) {
        if (!onMinimize) setIsMaximized(false); 
      }
    }
  };

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore
      if (preMaximizedState) {
        setWindowState(preMaximizedState);
      } else {
        // Fallback if no pre-state
        setWindowState(prev => ({ ...prev, width: 500, height: 600, x: 100, y: 50 }));
      }
    } else {
      // Maximize
      setPreMaximizedState(windowState);
      setWindowState({
        x: 0,
        y: 0,
        width: viewportSize.width || window.innerWidth,
        height: viewportSize.height || window.innerHeight
      });
    }
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  if (isClosed) return null;

  return (
    <Rnd
      style={style}
      onMouseDown={onMouseDown}
      dragHandleClassName="hq-window--header"
      
      // Directly use windowState. Rnd is fully controlled here.
      size={{ width: windowState.width, height: windowState.height }}
      position={{ x: windowState.x, y: windowState.y }}
      
      onDragStop={(e, d) => {
        if (!isMinimized && !isMaximized) {
          setWindowState((prev) => ({ ...prev, x: d.x, y: d.y }));
        }
      }}
      
      onResizeStop={(e, direction, ref, delta, position) => {
        setWindowState({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      
      disableDragging={isMaximized || isMinimized}
      enableResizing={!isMaximized && !isMinimized}
      className={`hq-window ${isMaximized ? 'hq-window--maximized' : ''} ${
        isMinimized ? 'hq-window--minimized' : ''
      }`}
      bounds="parent"
    >
      <WindowHeader
        windowTitle={windowTitle}
        showWindowActions={showWindowActions}
        onClose={handleClose}
        onMaximize={handleMaximize}
        onMinimize={isMinimized ? undefined : handleMinimize}
      />
      {!isMinimized && <div className="hq-window--content">{children}</div>}
    </Rnd>
  );
};

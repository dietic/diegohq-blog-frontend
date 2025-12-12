'use client';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import './Window.scss';
import { WindowHeader } from './WindowHeader/WindowHeader';

export interface WindowProps {
  showWindowActions?: boolean;
  windowTitle: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
}

export const Window = ({
  showWindowActions = true,
  windowTitle,
  children,
  onClose,
  onMinimize,
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [windowState, setWindowState] = useState({
    x: 100,
    y: 50,
    width: 500,
    height: 600,
  });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

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
        setIsMaximized(false);
      }
    }
  };

  const handleMaximize = () => {
    if (isMaximized) {
      // When restoring from maximized, center the window
      const centerX = (viewportSize.width - windowState.width) / 2;
      const centerY = (viewportSize.height - windowState.height) / 2;
      setWindowState((prev) => ({ ...prev, x: centerX, y: centerY }));
    }
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  if (isClosed) return null;

  const getPosition = () => {
    if (isMaximized) return { x: 0, y: 0 };
    if (isMinimized) {
      // Position is handled by CSS when minimized
      return { x: 0, y: 0 };
    }
    return { x: windowState.x, y: windowState.y };
  };

  const getSize = () => {
    if (isMaximized) return { width: '100%', height: '100%' };
    if (isMinimized) return { width: 250, height: 40 }; // Header height only
    return { width: windowState.width, height: windowState.height };
  };

  return (
    <Rnd
      dragHandleClassName="hq-window--header"
      size={getSize()}
      position={getPosition()}
      onDrag={(e: any, d) => {
        // Only restore from maximized when actually dragging (moved more than a few pixels)
        if (isMaximized && (Math.abs(d.deltaX) > 2 || Math.abs(d.deltaY) > 2)) {
          setIsMaximized(false);
          // Calculate new X to center the window on the mouse cursor
          const newX = e.clientX - windowState.width / 2;
          const newY = e.clientY - 20; // Offset for header height approx
          setWindowState((prev) => ({ ...prev, x: newX, y: newY }));
        }
      }}
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
      disableDragging={isMinimized}
      enableResizing={!isMaximized && !isMinimized}
      className={`hq-window ${isMaximized ? 'hq-window--maximized' : ''} ${
        isMinimized ? 'hq-window--minimized' : ''
      }`}
    >
      <WindowHeader
        windowTitle={windowTitle}
        showWindowActions={showWindowActions}
        onClose={handleClose}
        onMaximize={handleMaximize}
        onMinimize={isMinimized ? undefined : handleMinimize}
      />
      <div className="hq-window--content">{children}</div>
    </Rnd>
  );
};

'use client';
import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Rnd } from 'react-rnd';
import './Window.scss';
import { WindowHeader } from './WindowHeader/WindowHeader';

export interface WindowProps {
  isOpen?: boolean;
  showWindowActions?: boolean;
  windowTitle: string;
  windowIcon?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  style?: React.CSSProperties;
  onMouseDown?: () => void;
  beforeClose?: () => boolean;
  initialMaximized?: boolean;
}

export const Window = ({
  isOpen = false,
  showWindowActions = true,
  windowTitle,
  windowIcon,
  children,
  onClose,
  onMinimize,
  style,
  onMouseDown,
  beforeClose,
  initialMaximized = false,
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(!isOpen);

  const [windowState, setWindowState] = useState(() => {
    if (initialMaximized && typeof window !== 'undefined') {
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      x: 100,
      y: 50,
      width: 500,
      height: 600,
    };
  });

  const [preMaximizedState, setPreMaximizedState] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Ref to the Rnd component for accessing its methods
  const rndRef = useRef<Rnd>(null);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setViewportSize({ width: newWidth, height: newHeight });

      if (isMaximized) {
        setWindowState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
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
  }, [isMaximized]);

  const handleClose = () => {
    // Check if beforeClose allows closing
    if (beforeClose && !beforeClose()) {
      return; // Prevent close
    }
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
      if (preMaximizedState) {
        setWindowState(preMaximizedState);
      } else {
        setWindowState((prev) => ({
          ...prev,
          width: 500,
          height: 600,
          x: 100,
          y: 50,
        }));
      }
    } else {
      setPreMaximizedState(windowState);
      setWindowState({
        x: 0,
        y: 0,
        width: viewportSize.width || window.innerWidth,
        height: viewportSize.height || window.innerHeight,
      });
    }
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  // Handle header mousedown - immediately restore from maximized before drag starts
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const restoredWidth = preMaximizedState?.width || 500;
      const restoredHeight = preMaximizedState?.height || 600;

      // Calculate cursor position as percentage of maximized window width
      const percentX = mouseX / windowState.width;

      // Calculate where the window SHOULD be positioned
      const targetX = Math.max(0, mouseX - restoredWidth * percentX);
      const targetY = Math.max(0, mouseY - 60); // Approximate title bar height

      // Use flushSync to force synchronous update BEFORE drag starts
      flushSync(() => {
        setIsMaximized(false);
        setWindowState({
          x: targetX,
          y: targetY,
          width: restoredWidth,
          height: restoredHeight,
        });
      });

      // Sync Rnd's internal state after DOM update
      if (rndRef.current) {
        rndRef.current.updatePosition({ x: targetX, y: targetY });
        rndRef.current.updateSize({ width: restoredWidth, height: restoredHeight });
      }
    }
  };

  // Handle drag - nothing special needed, normal drag behavior
  const handleDrag = () => {
    // Normal drag is handled by react-rnd
    // Restore from maximized is already done in handleHeaderMouseDown
  };

  // Handle drag start - nothing needed here, restore is done in handleHeaderMouseDown
  const handleDragStart = () => {
    // Restore from maximized is handled in handleHeaderMouseDown with flushSync
    // This ensures the window is already at the correct position before drag starts
  };

  // Handle drag stop - update state with final position
  const handleDragStop = (_e: unknown, d: { x: number; y: number }) => {
    if (isMinimized) return;
    setWindowState((prev) => ({ ...prev, x: d.x, y: d.y }));
  };

  if (isClosed) return null;

  return (
    <Rnd
      ref={rndRef}
      style={style}
      onMouseDown={onMouseDown}
      dragHandleClassName="hq-window--header"
      size={{ width: windowState.width, height: windowState.height }}
      position={{ x: windowState.x, y: windowState.y }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
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
      bounds="parent"
    >
      <WindowHeader
        windowTitle={windowTitle}
        windowIcon={windowIcon}
        showWindowActions={showWindowActions}
        onClose={handleClose}
        onMaximize={handleMaximize}
        onMinimize={isMinimized ? undefined : handleMinimize}
        onMouseDown={handleHeaderMouseDown}
      />
      {!isMinimized && <div className="hq-window--content">{children}</div>}
    </Rnd>
  );
};

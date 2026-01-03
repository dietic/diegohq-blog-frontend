'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import './DesktopIcon.scss';

export interface DesktopIconProps {
  label: string;
  icon: string;
  initialX?: number;
  initialY?: number;
  windowUrl?: string;
  onDoubleClick?: () => void;
}

export default function DesktopIcon({
  label,
  icon,
  initialX = 0,
  initialY = 0,
  onDoubleClick,
}: DesktopIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setIsSelected(true);

    // Clear any existing timer first (important for double-click detection)
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    // Start a timer - if no double click within 250ms, show tooltip
    clickTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 250);
  }, []);

  const handleDoubleClick = useCallback(() => {
    // Cancel the single click timer to prevent tooltip from showing
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    setShowTooltip(false);
    onDoubleClick?.();
  }, [onDoubleClick]);

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending click timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    setIsSelected(false);
    setShowTooltip(false);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Auto-hide tooltip after 2 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <Rnd
      className="hq-desktop-icon"
      enableResizing={false}
      default={{ x: initialX, y: initialY, width: 90, height: 80 }}
    >
      <div
        className={`hq-desktop-icon__container ${isSelected ? 'hq-desktop-icon__container--selected' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseLeave={handleMouseLeave}
        style={{ width: '100%', height: '100%' }}
      >
        <div className="hq-desktop-icon--overlay"></div>
        <Image src={icon} alt="logo" height={60} width={60} />
        <div className="hq-desktop-icon--label">{label}</div>

        {showTooltip && (
          <div className="hq-desktop-icon__tooltip">
            Double-click to open
          </div>
        )}
      </div>
    </Rnd>
  );
}

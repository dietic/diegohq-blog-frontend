'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import './DesktopIcon.scss';

export interface DesktopIconProps {
  label: string;
  icon: string;
  initialX?: number;
  initialY?: number;
  windowUrl?: string;
  onOpen?: () => void;
}

export default function DesktopIcon({
  label,
  icon,
  initialX = 0,
  initialY = 0,
  onOpen,
}: DesktopIconProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleDoubleClick = () => {
    if (onOpen) {
      onOpen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onOpen) {
        onOpen();
      }
    }
  };

  return (
    <Rnd
      className={`hq-desktop-icon ${isFocused ? 'hq-desktop-icon--focused' : ''}`}
      enableResizing={false}
      default={{ x: initialX, y: initialY, width: 90, height: 80 }}
    >
      <div
        className="hq-desktop-icon__content"
        onDoubleClick={handleDoubleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Open ${label}`}
      >
        <div className="hq-desktop-icon__overlay"></div>
        <Image
          src={icon}
          alt={label}
          height={40}
          width={40}
          className="hq-desktop-icon__image"
        />
        <div className="hq-desktop-icon__label">{label}</div>
      </div>
    </Rnd>
  );
}

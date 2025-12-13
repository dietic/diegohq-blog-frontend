'use client';
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
  return (
    <Rnd
      className="hq-desktop-icon"
      enableResizing={false}
      default={{ x: initialX, y: initialY, width: 90, height: 80 }}
    >
      <div 
        className="hq-desktop-icon__container" 
        onDoubleClick={onDoubleClick}
        style={{ width: '100%', height: '100%' }}
      >
        <div className="hq-desktop-icon--overlay"></div>
        <Image src={icon} alt="logo" height={60} width={60} />
        <div className="hq-desktop-icon--label">{label}</div>
      </div>
    </Rnd>
  );
}

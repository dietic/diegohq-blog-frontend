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
}

export default function DesktopIcon({
  label,
  icon,
  initialX = 0,
  initialY = 0,
}: DesktopIconProps) {
  return (
    <Rnd
      className="hq-desktop-icon"
      enableResizing={false}
      default={{ x: initialX, y: initialY }}
    >
      <div className="hq-desktop-icon--overlay"></div>
      <Image src={icon} alt="logo" height={40} width={40} />
      <div className="hq-desktop-icon--label">{label}</div>
    </Rnd>
  );
}

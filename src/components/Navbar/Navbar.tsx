'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './Navbar.scss';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  return (
    <div className="hq-navbar">
      <div className="hq-navbar__section hq-navbar__section--left">
        <div className="hq-navbar__logo">
          <Image
            src="/logo-journal.png"
            alt="Journal Logo"
            height={30}
            width={30}
          />
        </div>
        <div className="hq-navbar__title">Journal OS</div>
      </div>
      <div className="hq-navbar__section hq-navbar__section--center" suppressHydrationWarning>
        {mounted && currentTime.toLocaleDateString(undefined, dateOptions)}
      </div>
      <div className="hq-navbar__section hq-navbar__section--right" suppressHydrationWarning>
        {mounted && (
          <>
            {hours}:{minutes < 10 ? '0' : ''}{minutes}
          </>
        )}
      </div>
    </div>
  );
}

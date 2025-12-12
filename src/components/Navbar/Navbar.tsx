'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './Navbar.scss';

export default function Navbar() {
  const date = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="hq-navbar">
      <div className="flex flex-1 pl-4">
        <div className="flex items-center">
          <Image
            src="/logo-journal.png"
            alt="Journal Logo"
            height={30}
            width={30}
          />
        </div>
        <div className="flex-1 p-2">Journal OS</div>
      </div>
      <div className="border-red rounded-lg flex-1 p-2">
        {date.toLocaleDateString(undefined, dateOptions)}
      </div>
      <div className="p-2">
        {new Date(time).getHours()}:
        {new Date(time).getMinutes() < 10 ? '0' : ''}
        {new Date(time).getMinutes()}
      </div>
    </div>
  );
}

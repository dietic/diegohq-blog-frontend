import Image from 'next/image';
import { vt323 } from './fonts';
import { Button } from '@/components/ui/8bit/button';

export default function Home() {
  return (
    <div className="h-svh w-full flex items-center flex-col gap-8 justify-center bg-[url('/background-9-16.png')] md:bg-[url('/background-16-9.png')] bg-center bg-cover">
      {/* <h1 className={`text-center text-background text-6xl leading-8 mb-8 drop-shadow-lg drop-shadow-`}>DIEGO HQ<br /><span className="text-2xl">Journal</span></h1> */}
      <Image
        src="/diegohqlogo.png"
        alt="Diego HQ Journal Logo"
        width={400}
        height={200}
        className="-mb-20"
      />
      <Button size="lg">Login</Button>
      <Button size="lg">Sign up</Button>
      <div
        className={`border-2 border-[#3F3F3F] text-primary-foreground px-4 py-2 ${vt323.className}`}
      >
        <span className="mr-4">🎮</span>
        DEV - VAN LIFE - PERSONAL GROWTH
        <span className="ml-4">🎮</span>
      </div>
    </div>
  );
}

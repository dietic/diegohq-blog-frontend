import Desktop from '@/components/Desktop/Desktop';
import { Window } from '@/components/Window/Window';

export default function Home() {
  // Reconstructing the dummy data structure based on the original component props.
  const dummyIcons = [
    {
      icon: '/desktop-icons/chest.png',
      label: 'Inventory',
      initialX: 20,
      initialY: 20,
    },
    {
      icon: '/desktop-icons/book.png',
      label: 'Journal',
      initialX: 20,
      initialY: 120,
    },
    {
      icon: '/desktop-icons/mypc.png',
      label: 'My Computer',
      initialX: 20,
      initialY: 220,
    },
  ];

  return <Desktop icons={dummyIcons}></Desktop>;
}

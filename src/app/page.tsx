import Desktop from '@/components/Desktop/Desktop';

export default function Home() {
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
      initialY: 140,
    },
    {
      icon: '/desktop-icons/mypc.png',
      label: 'My Computer',
      initialX: 20,
      initialY: 260,
    },
  ];

  return <Desktop icons={dummyIcons}></Desktop>;
}

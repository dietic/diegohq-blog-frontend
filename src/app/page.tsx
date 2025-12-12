import Desktop from '@/stories/components/Desktop/Desktop';
import { Window } from '@/stories/components/Window/Window';

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

  return (
    <Desktop icons={dummyIcons}>
      <Window windowTitle="Welcome to DiegoHQ">
        <div className="p-4">
          <p>This is a test window to verify the new functionality.</p>
          <p>Try minimizing, maximizing, and closing this window!</p>
        </div>
      </Window>
    </Desktop>
  );
}

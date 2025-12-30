'use client';
import DesktopIcon, { DesktopIconProps } from '../DesktopIcon/DesktopIcon';
import Navbar from '../Navbar/Navbar';
import { useWindowManager } from '../Window/WindowContext';
import { Window } from '../Window/Window';
import './Desktop.scss';

export interface DesktopProps {
  icons: DesktopIconProps[];
  children?: React.ReactNode;
}

export default function Desktop({ icons, children }: DesktopProps) {
  const {
    openWindows,
    activeWindowId,
    closeWindow,
    focusWindow,
    openWindow,
    minimizeWindow,
  } = useWindowManager();

  const handleOpenTestWindow = (icon: DesktopIconProps) => {
    openWindow({
      id: icon.label.toLowerCase().replace(' ', '-'),
      title: icon.label,
      component: (
        <div
          className="p-4"
          style={{ fontFamily: 'VT323', fontSize: '1.2rem' }}
        >
          <h2 className="text-xl mb-4">Welcome to {icon.label}</h2>
          <p>This content is managed by the Window Manager.</p>
        </div>
      ),
      icon: icon.icon,
    });
  };

  return (
    <div className="hq-desktop">
      <Navbar />
      <div className="hq-desktop__content">
        {icons &&
          icons.map((icon, idx) => {
            return (
              <DesktopIcon
                key={idx}
                label={icon.label}
                icon={icon.icon}
                initialX={icon.initialX}
                initialY={icon.initialY}
                onDoubleClick={() => handleOpenTestWindow(icon)}
              />
            );
          })}

        {/* Render Open Windows */}
        {openWindows.map((win) => (
          <Window
            key={win.id}
            windowTitle={win.title}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            isOpen={true}
            onMouseDown={() => focusWindow(win.id)}
            style={{
              zIndex: activeWindowId === win.id ? 200 : 100,
              display: win.isMinimized ? 'none' : 'block',
            }}
          >
            {win.component}
          </Window>
        ))}

        {children}
      </div>
    </div>
  );
}

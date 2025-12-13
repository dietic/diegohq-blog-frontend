import DesktopIcon, { DesktopIconProps } from '../DesktopIcon/DesktopIcon';
import Navbar from '../Navbar/Navbar';
import './Desktop.scss';

export interface DesktopProps {
  icons: DesktopIconProps[];
  children?: React.ReactNode;
}

export default function Desktop({ icons, children }: DesktopProps) {
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
              />
            );
          })}
        {children}
      </div>
    </div>
  );
}

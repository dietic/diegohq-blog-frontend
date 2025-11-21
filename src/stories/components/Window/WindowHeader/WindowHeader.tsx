import './WindowHeader.scss';

import { pixelifySans, pressStart2P } from '../../../../app/fonts';
import { WindowButton } from '../WindowButton/WindowButton';

export interface WindowHeaderProps {
  showWindowActions?: boolean;
  windowTitle: string;
  windowIcon?: string;
}

enum WindowAction {
  CLOSE = 'close',
  MAXIMIZE = 'maximize',
  MINIMIZE = 'minimze',
}

export const WindowActionButtons = () => {
  const windowActions = [
    {
      key: WindowAction.MINIMIZE,
      icon: 'minus',
    },
    {
      key: WindowAction.MAXIMIZE,
      icon: 'scale',
    },
    {
      key: WindowAction.CLOSE,
      icon: 'close',
    },
  ];

  return (
    <div className="hq-window--header-actions">
      {windowActions.map((action) => (
        <WindowButton key={action.key} iconName={action.icon} />
      ))}
    </div>
  );
};

export const WindowHeader = ({
  windowTitle,
  windowIcon = '🖥️',
  showWindowActions = true,
}: WindowHeaderProps) => {
  return (
    <div className="hq-window--header">
      <span className="hq-window--icon">{windowIcon}</span>
      <h1 className={` ${pressStart2P.className} hq-window--title`}>
        {windowTitle}
      </h1>
      {showWindowActions && <WindowActionButtons />}
    </div>
  );
};

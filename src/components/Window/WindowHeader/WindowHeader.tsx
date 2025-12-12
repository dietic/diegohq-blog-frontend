import './WindowHeader.scss';

import { vt323 } from '../../../app/fonts';
import { WindowButton } from '../WindowButton/WindowButton';

export interface WindowHeaderProps {
  showWindowActions?: boolean;
  windowTitle: string;
  windowIcon?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

enum WindowAction {
  CLOSE = 'close',
  MAXIMIZE = 'maximize',
  MINIMIZE = 'minimze',
}

export const WindowActionButtons = ({
  onMinimize,
  onMaximize,
  onClose,
}: {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}) => {
  const windowActions = [
    {
      key: WindowAction.MINIMIZE,
      icon: 'minus',
      action: onMinimize,
      hidden: !onMinimize,
    },
    {
      key: WindowAction.MAXIMIZE,
      icon: 'scale',
      action: onMaximize,
      hidden: false,
    },
    {
      key: WindowAction.CLOSE,
      icon: 'close',
      action: onClose,
      hidden: false,
    },
  ];

  return (
    <div className="hq-window--header-actions">
      {windowActions
        .filter((action) => !action.hidden)
        .map((action) => (
          <WindowButton
            key={action.key}
            iconName={action.icon}
            onClick={action.action}
          />
        ))}
    </div>
  );
};

export const WindowHeader = ({
  windowTitle,
  windowIcon = '🖥️',
  showWindowActions = true,
  onMinimize,
  onMaximize,
  onClose,
}: WindowHeaderProps) => {
  return (
    <div className="hq-window--header">
      <span className="hq-window--icon">{windowIcon}</span>
      <span className={`hq-window--title ${vt323.className}`}>
        {windowTitle}
      </span>
      {showWindowActions && (
        <WindowActionButtons
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />
      )}
    </div>
  );
};

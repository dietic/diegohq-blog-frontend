import './Window.scss';
import { Rnd } from 'react-rnd';
import { WindowHeader } from './WindowHeader/WindowHeader';

export interface WindowProps {
  showWindowActions?: boolean;
  windowTitle: string;
}

export const Window = ({
  showWindowActions = true,
  windowTitle,
}: WindowProps) => {
  const startingWindowPosition = {
    x: -400,
    y: 0,
    width: 500,
    height: 600,
  };
  return (
    <Rnd
      dragHandleClassName="hq-window--header"
      default={startingWindowPosition}
      className="hq-window"
    >
      <WindowHeader
        windowTitle={windowTitle}
        showWindowActions={showWindowActions}
      />
    </Rnd>
  );
};

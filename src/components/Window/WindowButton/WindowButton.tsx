import { Icon } from '@nsmr/pixelart-react';
import './WindowButton.scss';

export interface WindowButtonProps {
  iconName: string;
  onClick?: () => void;
}

export const WindowButton = ({ iconName, onClick }: WindowButtonProps) => {
  return (
    <button className="hq-window--button" onClick={onClick}>
      <Icon name={iconName} size={12} />
    </button>
  );
};

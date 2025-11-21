import { Icon } from '@nsmr/pixelart-react';
import './WindowButton.scss';

export interface WindowButtonProps {
  key: string;
  iconName: string;
}

export const WindowButton = ({ key, iconName }: WindowButtonProps) => {
  return (
    <button className="hq-window--button">
      <Icon name={iconName} size={12} />
    </button>
  );
};

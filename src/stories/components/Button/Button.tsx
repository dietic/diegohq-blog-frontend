import './Button.scss';
import { Roboto_Mono } from 'next/font/google';
export interface ButtonProps {
  variant?: 'primary' | 'outline';
  size?: 'xs' | 'md' | 'lg';
  label: string;
}

const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const Button = ({
  variant = 'primary',
  size = 'md',
  label,
  ...props
}: ButtonProps) => {
  const variantClass = `${robotoMono.className} hq-button hq-button--${variant} hq-button--${size}`;
  return (
    <button className={variantClass} type="button">
      {label}
    </button>
  );
};

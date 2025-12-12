import { Meta, StoryObj } from '@storybook/nextjs-vite';
import DesktopIcon from './DesktopIcon';

const meta = {
  title: 'DesktopIcon',
  component: DesktopIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DesktopIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'label',
    icon: './desktop-icons/chest.png',
  },
};

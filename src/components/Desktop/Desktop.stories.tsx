import { Meta, StoryObj } from '@storybook/nextjs-vite';
import Desktop from './Desktop';

const meta = {
  title: 'Desktop',
  component: Desktop,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Desktop>;

export default meta;

type Story = StoryObj<typeof meta>;

const dummyIcons = [
  {
    icon: './desktop-icons/chest.png',
    label: 'label1',
    initialX: 20,
    initialY: 20,
  },
  {
    icon: './desktop-icons/potion.png',
    label: 'label2',
    initialX: 20,
    initialY: 100,
  },
];
export const Default: Story = {
  args: {
    icons: dummyIcons,
  },
};

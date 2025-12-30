import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navbar from './Navbar';

const meta = {
  title: 'Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

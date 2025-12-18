import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Window } from './Window';
import { SampleWindow } from './SampleWindow';

const meta = {
  title: 'Window',
  component: Window,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Window>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    windowTitle: 'Quests',
  },
  render: (args) => (
    <Window {...args}>
      <SampleWindow />
    </Window>
  ),
};

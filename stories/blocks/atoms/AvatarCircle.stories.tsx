import type { Meta, StoryObj } from '@storybook/react';
import AvatarCircle from './AvatarCircle';

const meta: Meta<typeof AvatarCircle> = {
  title: 'Tracker/Atoms/AvatarCircle',
  component: AvatarCircle,
  parameters: {
    docs: {
      description: {
        component:
          'This is the tiny block responsible for displaying users\' initials in a neat circle. Like the artist formerly known as Prince, all you need is one letter to make a statement.',
      },
    },
  },
  tags: ['#ohYeahPizza', 'tracker'],
  args: {}
};

export default meta;
type Story = StoryObj<typeof AvatarCircle>;

export const Default: Story = {
  args: {
    firstName: 'jimmy',
    lastName: 'johnsom',
    size: 10
  }
};

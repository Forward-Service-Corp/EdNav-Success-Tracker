import type { Meta, StoryObj } from '@storybook/react';
import ClientNameBlock from './ClientNameBlock';

const meta: Meta<typeof ClientNameBlock> = {
  title: 'Tracker/Atoms/ClientNameBlock',
  component: ClientNameBlock,
  parameters: {
    docs: {
      description: {
        component:
          'Displays a client\'s full name and their most recent interaction date. Like a name tag with a timestamp'
      }
    }
  },
  tags: ['#ohYeahPizza', 'tracker'],
  args: {}
};

export default meta;
type Story = StoryObj<typeof ClientNameBlock>;

export const Default: Story = {};

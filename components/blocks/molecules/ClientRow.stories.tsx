import type { Meta, StoryObj } from '@storybook/react';
import ClientRow from './ClientRow';

const meta: Meta<typeof ClientRow> = {
  title: 'Tracker/Molecules/ClientRow',
  component: ClientRow,
  parameters: {
    docs: {
      description: {
        component:
          'Each row in your table, like a well-behaved student in a classroom, waiting to be clicked. Shows avatar, name, status, county, and a \'details\' button'
      }
    }
  },
  tags: ['#ohYeahPizza', 'tracker'],
  args: {}
};

export default meta;
type Story = StoryObj<typeof ClientRow>;

export const Default: Story = {};

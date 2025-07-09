import type { Meta, StoryObj } from '@storybook/react';
import ClientTableContainer from './ClientTableContainer';

const meta: Meta<typeof ClientTableContainer> = {
  title: 'Tracker/Organisms/ClientTableContainer',
  component: ClientTableContainer,
  parameters: {
    docs: {
      description: {
        component:
          'The big kahuna. It holds everything together like a family dinner, minus the awkward conversations. This component manages filters and state logic'
      }
    }
  },
  tags: ['#ohYeahPizza', 'tracker'],
  args: {}
};

export default meta;
type Story = StoryObj<typeof ClientTableContainer>;

export const Default: Story = {};

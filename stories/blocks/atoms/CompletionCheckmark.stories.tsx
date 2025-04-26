import type { Meta, StoryObj } from '@storybook/react';
import { CompletionCheckmark } from './CompletionCheckmark';

const meta: Meta<typeof CompletionCheckmark> = {
  title: 'Tracker/Atoms/CompletionCheckmark',
  component: CompletionCheckmark,
  parameters: {
    docs: {
      description: {
        component:
          'A tiny visual cue to indicate that something has been completed—like a green light for data.'
      }
    }
  },
  tags: ['#ohYeahPizza', 'tracker'],
  args: {
    completed: false
  }
};

export default meta;
type Story = StoryObj<typeof CompletionCheckmark>;

export const Default: Story = {};

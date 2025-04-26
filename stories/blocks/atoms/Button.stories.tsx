// components/YourComponent/YourComponent.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/YourComponent', // Storybook left-nav title
  component: Button,
  tags: ['autodocs'], // Storybook 7 auto-generate docs magic
  parameters: {
    layout: 'centered' // Center the component in the preview
  },
  args: {
    // Default props
    type: 'Default value'
  },
  argTypes: {
    type: {
      control: 'text',
      description: 'An example text prop for demonstration.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Default value' }
      }
    }
  } as const
};

export default meta;
type ButtonStories = StoryObj<typeof Button>;

export const Default: ButtonStories = {
  args: {}
};

export const Custom: ButtonStories = {
  args: {
    type: 'Custom Value'
  }
};
// ClientRow.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientRow from './ClientRow';
import { ClientsProvider } from '@/contexts/ClientContext';

const meta: Meta<typeof ClientRow> = {
  title: 'Components/ClientRow',
  component: ClientRow,
  decorators: [
    (Story) => (
      <ClientsProvider>
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </ClientsProvider>
    )
  ],
  args: {
    person: {
      _id: 'string',
      first_name: 'string',
      last_name: 'string',
      latestInteraction: 'string',
      clientStatus: 'string',
      county: 'string',
      navigator: 'string',
      group: 'string'
    }
  },
  argTypes: {
    person: {
      clientStatus: {
        control: { type: 'select', options: ['active', 'inactive', 'in-progress', 'graduated'] }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ClientRow>;

// Default story with a static status
export const Default: Story = {};
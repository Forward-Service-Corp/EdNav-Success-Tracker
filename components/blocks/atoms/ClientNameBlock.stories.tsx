// /components/blocks/atoms/ClientNameBlock.stories.tsx

import type { Meta, StoryObj } from "@storybook/react";
import ClientNameBlock from "./ClientNameBlock";

const meta: Meta<typeof ClientNameBlock> = {
  title: "Tracker/Atoms/ClientNameBlock",
  component: ClientNameBlock,
  tags: ["#ohYeahPizza", "atom", "tracker"],
  args: {
    firstName: "Janet",
    lastName: "Jackson",
    latestInteraction: "4/22/2025",
  },
};

export default meta;
type Story = StoryObj<typeof ClientNameBlock>;

export const Default: Story = {};

// /components/blocks/atoms/StatusBadge.stories.tsx

import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Tracker/Atoms/StatusBadge",
  component: StatusBadge,
  tags: ["#ohYeahPizza", "atom", "tracker"],
  args: {
    status: "Active",
    isSelected: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {};
export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

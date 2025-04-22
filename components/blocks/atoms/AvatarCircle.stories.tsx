// /components/blocks/atoms/Avatar.stories.tsx

import type { Meta, StoryObj } from "@storybook/react";
import AvatarCircle from "./AvatarCircle";

const meta: Meta<typeof AvatarCircle> = {
  title: "Tracker/Atoms/Avatar",
  component: AvatarCircle,
  tags: ["#ohYeahPizza", "atom", "tracker"],
  args: {
    firstName: "Jane",
    lastName: "Doe",
    size: 36,
  },
};

export default meta;
type Story = StoryObj<typeof AvatarCircle>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Tracker/Atoms/StatusBadge",
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          "These are the colorful tabs showing a client's status—think of them as mood rings for your data. You can color-code them to match your mood or your socks.",
      },
    },
  },
  tags: ["#ohYeahPizza", "tracker"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {};

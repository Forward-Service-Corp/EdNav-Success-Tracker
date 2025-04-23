import type { Meta, StoryObj } from "@storybook/react";
import SuccessMessage from "./SuccessMessage";

const meta: Meta<typeof SuccessMessage> = {
  title: "Tracker/Atoms/SuccessMessage",
  component: SuccessMessage,
  parameters: {
    docs: {
      description: {
        component:
          "Displays a subtle success notification—more polite than a pop-up, more stylish than a toast.",
      },
    },
  },
  tags: ["#ohYeahPizza", "tracker"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof SuccessMessage>;

export const Default: Story = {};

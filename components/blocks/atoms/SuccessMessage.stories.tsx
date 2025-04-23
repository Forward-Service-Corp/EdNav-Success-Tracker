import type { Meta, StoryObj } from "@storybook/react";
import SuccessMessage from "./SuccessMessage";

const meta: Meta<typeof SuccessMessage> = {
  title: "Tracker/Atoms/SuccessMessage",
  component: SuccessMessage,
  tags: ["#ohYeahPizza", "atom", "tracker"],
  args: {
    message: "Success!",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a subtle success notification—more polite than a pop-up, more stylish than a toast.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SuccessMessage>;

export const Default: Story = {};
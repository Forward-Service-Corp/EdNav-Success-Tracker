import type { Meta, StoryObj } from "@storybook/react";
import ClientTableBody from "./ClientTableBody";

const meta: Meta<typeof ClientTableBody> = {
  title: "Tracker/Molecules/ClientTableBody",
  component: ClientTableBody,
  parameters: {
    docs: {
      description: {
        component:
          "The container for all your ClientRow components, like a cozy bed for all your data.",
      },
    },
  },
  tags: ["#ohYeahPizza", "tracker"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof ClientTableBody>;

export const Default: Story = {};

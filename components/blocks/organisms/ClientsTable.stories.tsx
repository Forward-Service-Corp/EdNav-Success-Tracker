// /components/blocks/organisms/ClientsTable.stories.tsx

import type { Meta, StoryObj } from "@storybook/react";
import ClientsTable from "./ClientsTable";

const meta: Meta<typeof ClientsTable> = {
  title: "Tracker/Organisms/ClientsTable",
  component: ClientsTable,
  tags: ["#ohYeahPizza", "organism", "tracker"],
  args: {
    clients: [
      {
        _id: "1",
        first_name: "Alicia",
        last_name: "Keys",
        latestInteraction: "2025-04-20",
        clientStatus: "Active",
        county: "Milwaukee",
      },
      {
        _id: "2",
        first_name: "Busta",
        last_name: "Rhymes",
        latestInteraction: "2025-04-18",
        clientStatus: "Graduated",
        county: "Madison",
      },
      {
        _id: "3",
        first_name: "CeeLo",
        last_name: "Green",
        latestInteraction: "2025-04-15",
        clientStatus: "Inactive",
        county: "Kenosha",
      },
    ],
    selectedClientId: null,
    setOpenPanel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ClientsTable>;

export const Default: Story = {};

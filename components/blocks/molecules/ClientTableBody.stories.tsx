// /components/blocks/molecules/ClientTableBody.stories.tsx

import { ClientsContext } from "@/contexts/ClientsContext";
import { EditingContext } from "@/contexts/EditingContext";
import type { Meta, StoryObj } from "@storybook/react";
import ClientTableBody from "./ClientTableBody";

const meta: Meta<typeof ClientTableBody> = {
  title: "Tracker/Molecules/ClientTableBody",
  component: ClientTableBody,
  tags: ["#ohYeahPizza", "molecule", "tracker"],
  decorators: [
    (Story) => (
      <EditingContext.Provider
        value={{
          editing: "false",
          setEditing: () => {},
        }}
      >
        <ClientsContext.Provider
          value={{
            setSelectedClient: () => {},
            selectedClient: null,
          }}
        >
          <table className="table w-full">
            <Story />
          </table>
        </ClientsContext.Provider>
      </EditingContext.Provider>
    ),
  ],
  args: {
    clients: [
      {
        _id: "a1",
        first_name: "Donna",
        last_name: "Summer",
        latestInteraction: "2025-04-21",
        clientStatus: "Active",
        county: "Racine",
      },
      {
        _id: "b2",
        first_name: "Elton",
        last_name: "John",
        latestInteraction: "2025-04-17",
        clientStatus: "Graduated",
        county: "Green Bay",
      },
    ],
    selectedClientId: null,
    setOpenPanel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ClientTableBody>;

export const Default: Story = {};

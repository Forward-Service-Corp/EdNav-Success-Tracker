// /components/blocks/molecules/ClientRow.stories.tsx

import { ClientsContext } from "@/contexts/ClientsContext";
import { EditingContext } from "@/contexts/EditingContext";
import type { Meta, StoryObj } from "@storybook/react";
import ClientRow from "./ClientRow";

const meta: Meta<typeof ClientRow> = {
  title: "Tracker/Molecules/ClientRow",
  component: ClientRow,
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
          <table>
            <tbody>
              <Story />
            </tbody>
          </table>
        </ClientsContext.Provider>
      </EditingContext.Provider>
    ),
  ],
  args: {
    person: {
      first_name: "Jordan",
      last_name: "Knight",
      latestInteraction: "Today",
      clientStatus: "Graduated",
      county: "Milwaukee",
      _id: "123",
    },
    selected: false,
    setOpenPanel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ClientRow>;

export const Default: Story = {};

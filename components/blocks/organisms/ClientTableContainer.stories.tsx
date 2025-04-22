// /components/blocks/organisms/ClientTableContainer.stories.tsx

import { ClientListContext } from "@/contexts/ClientListContext";
import { ClientsContext } from "@/contexts/ClientsContext";
import { EditingContext } from "@/contexts/EditingContext";
import { FepsLeftContext } from "@/contexts/FepsLeftContext";
import { NavigatorContext } from "@/contexts/NavigatorsContext";
import type { Meta, StoryObj } from "@storybook/react";
import ClientTableContainer from "./ClientTableContainer";

const mockClients = [
  {
    _id: "1",
    first_name: "Tina",
    last_name: "Turner",
    latestInteraction: "2025-04-20",
    clientStatus: "Active",
    county: "Milwaukee",
    navigator: "Jordan",
    group: "Adult",
  },
  {
    _id: "2",
    first_name: "David",
    last_name: "Bowie",
    latestInteraction: "2025-04-18",
    clientStatus: "Graduated",
    county: "Madison",
    navigator: "Jordan",
    group: "Adult",
  },
];

const meta: Meta<typeof ClientTableContainer> = {
  title: "Tracker/Organisms/ClientTableContainer",
  component: ClientTableContainer,
  tags: ["#ohYeahPizza", "organism", "tracker", "finale"],
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
          <ClientListContext.Provider value={{ clientList: mockClients }}>
            <NavigatorContext.Provider
              value={{
                selectedNavigator: {
                  _id: "all",
                  name: "All",
                  pinned: [],
                  preferences: {
                    theme: "light",
                    lastAgeFilter: "All",
                    lastStatusFilter: "All",
                  },
                  notifications: {
                    unread: [],
                    read: [],
                  },
                  streak: {
                    active: false,
                    streak: 0,
                    lastDate: new Date().toISOString(),
                    longestStreak: 0,
                    longestStreakDate: 0,
                  },
                },
                setSelectedNavigator: () => {},
              }}
            >
              <FepsLeftContext.Provider
                value={{
                  selectedFepLeft: {
                    searchTerm: "",
                    status: "All",
                    age: "All",
                    menuOpen: null,
                  },
                  setSelectedFepLeft: () => {},
                }}
              >
                <Story />
              </FepsLeftContext.Provider>
            </NavigatorContext.Provider>
          </ClientListContext.Provider>
        </ClientsContext.Provider>
      </EditingContext.Provider>
    ),
  ],
  args: {
    menuOpen: false,
    setMenuOpen: () => {},
    toggleSidebar: () => {},
    setOpenPanel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ClientTableContainer>;

export const Default: Story = {};

// /components/blocks/organisms/ClientTableContainer.tsx

import { useClientList } from "@/contexts/ClientListContext";
import { useClient } from "@/contexts/ClientContext";
import { useFepsLeft } from "@/contexts/FepsLeftContext";
import { useNavigator } from "@/contexts/NavigatorsContext";
import { useEffect, useMemo, useState } from "react";

import ClientsTable from "@/stories/blocks/organisms/ClientsTable";
import SearchBar from "../../../components/SearchField";
import { LayoutProvider } from "@/contexts/LayoutContext";

export default function ClientTableContainer({}: {
  menuOpen: boolean;
  setMenuOpen?: (val: boolean) => void; // Made optional since it's commented out
  toggleSidebar: () => void;
}) {
  const { clientList } = useClientList();
  const { selectedNavigator } = useNavigator();
  const { selectedFepLeft } = useFepsLeft();
  const { selectedClient } = useClient();

  const [isMounted, setIsMounted] = useState(false);
  const [viewMode] = useState<"pinned" | "grouped" | null>(null);

  const pinnedIds = selectedNavigator?.pinned || [];

  const filteredClients = useMemo(() => {
    if (!clientList) return [];
    return clientList
      .filter(
        (client: {
          navigator?: string;
          first_name?: string;
          last_name?: string;
          clientStatus?: string;
          group?: string;
          _id: { toString(): string };
        }) =>
          selectedNavigator?.name !== "All"
            ? client?.navigator === selectedNavigator?.name
            : true,
      )
      .filter(
        (client: {
          first_name: string;
          last_name: string;
          clientStatus: string;
          group: string;
        }) => {
          const matchesSearch =
            client?.first_name
              ?.toLowerCase()
              .includes(selectedFepLeft.searchTerm.toLowerCase()) ||
            client?.last_name
              ?.toLowerCase()
              .includes(selectedFepLeft.searchTerm.toLowerCase());

          const matchesStatus =
            selectedFepLeft.status === "All" ||
            client?.clientStatus.toLowerCase() ===
              selectedFepLeft.status.toLowerCase();

          const matchesGroup =
            selectedFepLeft.age === "All" ||
            client?.group === selectedFepLeft.age;

          return matchesSearch && matchesStatus && matchesGroup;
        },
      );
  }, [clientList, selectedNavigator, selectedFepLeft]);

  const clientsToShow = useMemo(() => {
    if (!filteredClients) return [];

    if (viewMode === "pinned") {
      return [...filteredClients].sort((a, b) => {
        const aPinned = pinnedIds.includes(a._id.toString());
        const bPinned = pinnedIds.includes(b._id.toString());
        return aPinned === bPinned ? 0 : aPinned ? -1 : 1;
      });
    }

    return filteredClients;
  }, [filteredClients, viewMode, pinnedIds]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <LayoutProvider>
      <div className="no-scrollbar relative z-0 h-full w-full">
        <div className="no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll">
          <SearchBar />
          <ClientsTable
            clients={clientsToShow}
            selectedClientId={selectedClient?._id || null}
          />
        </div>
      </div>
    </LayoutProvider>
  );
}

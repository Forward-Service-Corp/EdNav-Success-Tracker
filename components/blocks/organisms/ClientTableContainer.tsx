// /components/blocks/organisms/ClientTableContainer.tsx

import { useClientList } from '@/contexts/ClientListContext';
import { useClients } from '@/contexts/ClientsContext';
import { useFepsLeft } from '@/contexts/FepsLeftContext';
import { useNavigators } from '@/contexts/NavigatorsContext';
import { useEffect, useMemo, useState } from 'react';

import ClientsTable from '@/components/blocks/organisms/ClientsTable';
import SearchBar from '../../SearchField';

export default function ClientTableContainer({
                                               menuOpen,
                                               setOpenPanel,
                                               toggleSidebar
                                             }: {
  menuOpen: boolean;
  setMenuOpen?: (val: boolean) => void; // Made optional since it's commented out
  toggleSidebar: () => void;
  setOpenPanel: (panel: string | null) => void;
}) {
  const { clientList } = useClientList();
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft } = useFepsLeft();
  const { selectedClient } = useClients();

  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"pinned" | "grouped" | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

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
            : true
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
            client?.clientStatus === selectedFepLeft.status;

          const matchesGroup =
            selectedFepLeft.age === "All" ||
            client?.group === selectedFepLeft.age;

          return matchesSearch && matchesStatus && matchesGroup;
        }
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
    <div className="no-scrollbar relative z-0 h-full w-full">
      <div className="no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll">
        <div className="bg-base-200 sticky top-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow">
          <SearchBar
            menuOpen={menuOpen}
            // setMenuOpen={setMenuOpen}
            setFilterOpen={setFilterOpen}
            filterOpen={filterOpen}
            setViewMode={(mode: string) => {
              // Convert the string to the appropriate type
              if (mode === "pinned" || mode === "grouped" || mode === "") {
                setViewMode(mode === "" ? null : mode as "pinned" | "grouped");
              }
            }}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <ClientsTable
          clients={clientsToShow}
          selectedClientId={selectedClient?._id || null}
          setOpenPanel={setOpenPanel}
        />
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ClientsTable from "../stories/blocks/organisms/ClientsTable";
import SearchField from "./SearchField";
import { useClient } from "/contexts/ClientContext";
import { useClientList } from "/contexts/ClientListContext";
import { useFepsLeft } from "/contexts/FepsLeftContext";
import { useLayout } from "/contexts/LayoutContext";
import { useNavigator } from "/contexts/NavigatorsContext";

export default function ClientTable({ menuOpen, setMenuOpen, setOpen, open, toggleSidebar }) {
  const { clientList, loading, error } = useClientList();
  const { selectedNavigator } = useNavigator();
  const { selectedFepLeft } = useFepsLeft();
  const { selectedCliet } = useClient();
  const { currentLayout } = useLayout();
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [, setStatusCollapse] = useState([]);
  const tableRef = useRef(null);

  // State for tracking container width and visible columns
  const [, setContainerWidth] = useState(0);
  const [, setVisibleColumns] = useState({
    status: true,
    county: true,
    details: true,
  });

  / Update container width on layout changes
  useEffect(() => {
    if (tableRef.current) {
      updateContainerWidth();
    }
  }, [currentLayout, isMounted]);

  // Set up a resize observer to track container width changes
  useEffect(() => {
    if (!tableRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateContainerWidth();
      }
    });

    resizeObserver.observe(tableRef.current);

    return () => {
      if (tableRef.current) {
        resizeObserver.unobserve(tableRef.current);
      }
    };
  }, [isMounted]);

  // Update container width and determine which columns to show
  const updateContainerWidth = () => {
    if (!tableRef.current) return;

    const width = tableRef.current.offsetWidth;
    setContainerWidth(width);

    // Determine visible columns based on container width
    if (width < 400) {
      setVisibleColumns({
        status: false,
        county: false,
        details: true
      });
    } else if (width < 600) {
      setVisibleColumns({
        status: true,
        county: false,
        details: true
      });
    } else {
      setVisibleColumns({
        status: true,
        county: true,
        details: true
      });
    }
  };

  const filteredClients = useMemo(() => {
    // console.log(clientList);
    if (!clientList) return [];

    return clientList
      .sort((a, b) => {
        const aName = a?.first_name?.toLowerCase() || "z";
        const bName = b?.first_name?.toLowerCase() || "z";
        return aName.localeCompare(bName);
      })
      .filter((client) =>
        selectedNavigator !== "All"
          ? client?.navigator === selectedNavigator?.name
          : true,
      )
      .filter((client) => {
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
      });
  }, [clientList, selectedNavigator, selectedFepLeft, selectedClient]);

  function groupByClientStatus(clients) {
    return clients.reduce((groups, client) => {
      const status = client.clientStatus.toLowerCase() || "Unknown";
      if (!groups[status]) groups[status] = [];
      groups[status].push(client);
      return groups;
    }, {});
  }

  const pinnedIds = selectedNavigator?.pinned || [];

  const clientsToShow = useMemo(() => {
    if (!filteredClients) return [];

    if (selectedFepLeft.pinned) {
      return [...filteredClients].sort((a, b) => {
        const aPinned = pinnedIds.includes(a._id.toString());
        const bPinned = pinnedIds.includes(b._id.toString());
        return aPinned === bPinned ? 0 : aPinned ? -1 : 1;
      });
    }

    if (viewMode === "grouped") {
      return groupByClientStatus(filteredClients); // returns object
    }

    return filteredClients;
  }, [filteredClients, selectedClient, viewMode, pinnedIds]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;

  // Render loading state
  if (loading) {
    return (
      <div className="h-full w-full">
        <div className="flex h-full w-full flex-col">
          <div className="sticky top-0 z-50 flex h-[80px] w-full items-center justify-between px-3 py-4 shadow">
            <SearchField
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setFilterOpen={setFilterOpen}
              toggleSidebar={toggleSidebar}
              filterOpen={filterOpen}
              setViewMode={setViewMode}
              setStatusCollapse={setStatusCollapse}
            />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg"></div>
              <p className="text-base-content mt-4">Loading clients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="h-full w-full">
        <div className="flex h-full flex-col">
          <div className="bg-base-300 sticky top-0 z-50 flex h-[80px] w-full items-center justify-between px-3 py-4 shadow">
            <SearchField
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setFilterOpen={setFilterOpen}
              toggleSidebar={toggleSidebar}
              filterOpen={filterOpen}
              setViewMode={setViewMode}
              setStatusCollapse={setStatusCollapse}
            />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-error text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4 h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">Error Loading Clients</p>
              <p className="mt-1">{error}</p>
              <button
                className="btn btn-outline btn-error btn-sm mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" ref={tableRef}>
      <div className="bg-base-100 sticky top-0 z-50 flex h-[80px] w-full min-w-full items-center justify-between rounded px-3 py-4 shadow-lg">
        <SearchField />
      </div>

      <div className="no-scrollbar w-full min-w-full flex-1 overflow-y-auto">
        <div className="w-full">
          <ClientsTable
            clients={clientsToShow}
            selectedClientId={selectedClient?._id}
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientList } from '/contexts/ClientListContext';
import { useClient } from '/contexts/ClientContext';
import { useNavigator } from '/contexts/NavigatorsContext';
import { useLayout } from '/contexts/LayoutContext';
import { useFepsLeft } from '/contexts/FepsLeftContext';
import SearchField from './SearchField';
import ClientsTable from '../stories/blocks/organisms/ClientsTable';

export default function ClientTable({
  menuOpen,
  setMenuOpen,
  toggleSidebar,
  setOpenPanel,
}) {
  const { clientList, loading, error } = useClientList();
  const { selectedNavigator } = useNavigator();
  const { selectedFepLeft } = useFepsLeft();
  const { selectedClient } = useClient({});
  const { currentLayout } = useLayout();
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [, setStatusCollapse] = useState([]);
  const tableRef = useRef(null);

  // State for tracking container width and visible columns
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    county: true,
    details: true
  });

  // Update container width on layout changes
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

  const handleCollapseChange = (status) => {
    setStatusCollapse((prevState) => {
      if (prevState.includes(status)) {
        return prevState.filter((item) => item !== status);
      }
      return [...prevState, status];
    });
  };

  const filteredClients = useMemo(() => {
    // console.log(clientList);
    if (!clientList) return [];

    return clientList
      .filter((client) =>
        selectedNavigator !== 'All'
          ? client?.navigator === selectedNavigator
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
          client?.clientStatus === selectedFepLeft.status;

        const matchesGroup =
          selectedFepLeft.age === "All" ||
          client?.group === selectedFepLeft.age;

        return matchesSearch && matchesStatus && matchesGroup;
      });
  }, [clientList, selectedNavigator, selectedFepLeft]);

  const groupByClientStatus = (clients) => {
    return clients
      .filter((client) => {
        if (selectedNavigator && selectedNavigator.name !== "All")
          return client?.navigator === selectedNavigator?.name;
        return client;
      })
      .sort((a, b) => (a.clientStatus > b.clientStatus ? 1 : -1))
      .reduce((groups, client) => {
        const status = client.clientStatus || "Unknown";
        if (!groups[status]) groups[status] = [];
        groups[status].push(client);
        return groups;
      }, {});
  };

  const pinnedIds = selectedNavigator?.pinned || [];

  const clientsToShow = useMemo(() => {
    if (!filteredClients) return [];

    if (viewMode === "pinned") {
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
  }, [filteredClients, viewMode, pinnedIds]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;
// Render loading state
  if (loading) {
    return (
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col">
          <div className=" sticky top-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow w-full">
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
        <div className="h-full w-full flex flex-col">
          <div
            className="bg-base-300 sticky top-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow w-full">
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

  // Render an empty state
  if (clientList && clientList.length === 0) {
    return (
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col">
          <div
            className="bg-base-300 sticky top-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow w-full">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-base-content/50 mx-auto mb-4 h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-base-content/70">No clients found</p>
              {selectedNavigator && selectedNavigator.name !== "All" && (
                <p className="text-base-content/50 mt-1 text-sm">
                  No clients assigned to {selectedNavigator.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col" ref={tableRef}>
      <div
        className="bg-base-100 rounded sticky top-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow w-full">
        <SearchField />
      </div>

      <div className="flex-1 overflow-y-auto w-full no-scrollbar">
        <div className="w-full">
          <ClientsTable clients={clientsToShow} selectedClientId={selectedClient?._id} setOpenPanel={setOpenPanel} />
        </div>
      </div>
    </div>
  );
}
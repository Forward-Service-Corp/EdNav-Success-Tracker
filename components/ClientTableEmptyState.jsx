import React from 'react';
import SearchField from './SearchField';


function ClientTableEmptyState() {
  // const { clientList, loading, error } = useClientList();
}

// Render an empty state
let clientList = [];
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
            {selectedNavigator && selectedNavigator.name !== 'All' && (
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

export default ClientTableEmptyState;

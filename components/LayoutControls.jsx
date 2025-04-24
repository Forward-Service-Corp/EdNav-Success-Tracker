"use client";

import { useLayout } from "@/contexts/LayoutContext";

export default function LayoutControls() {
  const {
    setLayoutConfig,
    toggleSidebar,
    isSidebarVisible,
    isDetailsVisible,
    setIsDetailsVisible,
  } = useLayout();

  return (
    <div className="bg-base-200 border-base-300 flex items-center space-x-2 border-b p-2">
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className={`btn btn-sm ${isSidebarVisible ? "btn-primary" : "btn-outline"}`}
        aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="ml-1">Sidebar</span>
      </button>

      {/* Layout Presets */}
      <div className="flex space-x-1">
        <button
          onClick={() => setLayoutConfig("DEFAULT")}
          className="btn btn-sm btn-outline"
          title="Default Layout (15% / 35% / 50%)"
        >
          <div className="flex h-4 w-12 gap-px">
            <div className="bg-primary w-2"></div>
            <div className="bg-secondary w-4"></div>
            <div className="bg-accent w-6"></div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig("NO_SIDEBAR")}
          className="btn btn-sm btn-outline"
          title="No Sidebar (0% / 50% / 50%)"
        >
          <div className="flex h-4 w-12 gap-px">
            <div className="bg-secondary w-6"></div>
            <div className="bg-accent w-6"></div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig("TABLE_FOCUS")}
          className="btn btn-sm btn-outline"
          title="Table Focus (0% / 70% / 30%)"
        >
          <div className="flex h-4 w-12 gap-px">
            <div className="bg-secondary w-8"></div>
            <div className="bg-accent w-4"></div>
          </div>
        </button>
      </div>

      {/* Toggle Details Panel */}
      <button
        onClick={() => setIsDetailsVisible(!isDetailsVisible)}
        className={`btn btn-sm ml-auto ${isDetailsVisible ? "btn-primary" : "btn-outline"}`}
        aria-label={isDetailsVisible ? "Hide Details" : "Show Details"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="ml-1">Details</span>
      </button>
    </div>
  );
}

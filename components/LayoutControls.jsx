"use client";
import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/LayoutContext';

export default function LayoutControls() {
  const {
    setLayoutConfig,
    toggleSidebar,
    isSidebarVisible,
    currentLayout
  } = useLayout();

  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Track window width for responsive controls
  useEffect(() => {
    setIsMounted(true);

    // Initialize window width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);

      // Set up a resize listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Auto-select the optimal layout based on window width
  useEffect(() => {
    if (isMounted && windowWidth > 0) {
      // Only auto-adjust on an initial load or significant resize
      if (windowWidth < 768) {
        // For small screens, focus on a table with minimal details
        setLayoutConfig('NARROW');
      } else if (windowWidth < 1200 && currentLayout?.sidebar === 20) {
        // For medium screens with sidebar, balance table and details
        setLayoutConfig('MEDIUM_WITH_SIDEBAR');
      }
    }
  }, [isMounted, windowWidth, currentLayout?.sidebar]);

  // Helper to get correct opacity based on the current layout
  const getOpacity = (layoutName) => {
    // Get the current layout name from local storage or use DEFAULT
    const currentLayoutName = typeof window !== 'undefined'
      ? localStorage.getItem('currentLayout') || 'DEFAULT'
      : 'DEFAULT';

    return currentLayoutName === layoutName ? 'opacity-100' : 'opacity-50 hover:opacity-70';
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <div className="flex items-center space-x-2 border-0 p-2">
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className={`btn btn-sm rounded w-[22px] h-[22px] ${isSidebarVisible ? 'btn-success' : 'btn-outline btn-success '}`}
        aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Layout Presets */}
      <div className="flex space-x-1">
        <button
          onClick={() => setLayoutConfig("DEFAULT")}
          className="btn btn-sm h-full rounded-l p-0 w-[64px]"
          title="Default Layout (15% / 45% / 55%)"
        >
          <div className={`flex h-[22px] rounded overflow-hidden ${getOpacity('DEFAULT')}`}>
            <div className="bg-success h-full w-4"></div>
            <div className="flex flex-col justify-center items-center bg-info h-full w-9 gap-1">
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
            </div>
            <div className="bg-warning h-full w-11 flex items-center justify-center rounded-r">
            </div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig("NO_SIDEBAR")}
          className="btn btn-sm h-full p-0 w-[64px]"
          title="No Sidebar (0% / 50% / 50%)"
        >
          <div className={`flex h-[22px] rounded overflow-hidden ${getOpacity('NO_SIDEBAR')}`}>
            <div className="flex flex-col justify-center items-center bg-info h-full w-[30px] gap-1">
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
            </div>
            <div className="bg-warning h-full w-[30px] flex items-center justify-center rounded-r">
            </div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig("TABLE_FOCUS")}
          className="btn btn-sm h-full p-0 w-[64px]"
          title="Table Focus (0% / 70% / 30%)"
        >
          <div className={`flex h-[22px] rounded overflow-hidden ${getOpacity('TABLE_FOCUS')}`}>
            <div className="flex flex-col justify-center items-center bg-info h-full w-[42px] gap-1">
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
            </div>
            <div className="bg-warning h-full w-[18px] flex items-center justify-center rounded-r">
            </div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig('DETAILS_FOCUS')}
          className="btn btn-sm h-full p-0 w-[64px] hidden md:flex"
          title="Details Focus (0% / 30% / 70%)"
        >
          <div className={`flex h-[22px] rounded overflow-hidden ${getOpacity('DETAILS_FOCUS')}`}>
            <div className="flex flex-col justify-center items-center bg-info h-full w-[18px] gap-1">
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
            </div>
            <div className="bg-warning h-full w-[42px] flex items-center justify-center rounded-r">
            </div>
          </div>
        </button>

        <button
          onClick={() => setLayoutConfig('SIDEBAR_TABLE_ONLY')}
          className="btn btn-sm h-full p-0 w-[64px]"
          title="Sidebar and Table Only (15% / 85% / 0%)"
        >
          <div className={`flex h-[22px] rounded overflow-hidden ${getOpacity('SIDEBAR_TABLE_ONLY')}`}>
            <div className="bg-success h-full w-[15px]"></div>
            <div className="flex flex-col justify-center items-center bg-info h-full w-[49px] gap-1">
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
              <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
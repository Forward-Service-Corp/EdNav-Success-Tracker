import React, { useEffect, useState } from 'react';
import { useFepsLeft } from '@/contexts/FepsLeftContext';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { XCircle } from 'phosphor-react';
import { useLayout } from '@/contexts/LayoutContext';

function SearchField({
  filterOpen,
                       setViewMode
}: {
  menuOpen: boolean;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  setViewMode: (mode: string) => void;
  toggleSidebar: () => void;
}) {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();
  const { setLayoutConfig, currentLayout, isSidebarVisible, isDetailsVisible } = useLayout();
  const [activeLayout, setActiveLayout] = useState('DEFAULT');

  // Check which layout is active
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLayout = localStorage.getItem('currentLayout');
      setActiveLayout(savedLayout || 'DEFAULT');
    }

    // Set up an event listener for layout changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentLayout') {
        setActiveLayout(e.newValue || 'DEFAULT');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update when layout context changes
  useEffect(() => {
    // Convert the current layout to a preset name
    if (!isSidebarVisible && currentLayout.table === 50 && currentLayout.details === 50) {
      setActiveLayout('NO_SIDEBAR');
    } else if (!isSidebarVisible && currentLayout.table === 70 && currentLayout.details === 30) {
      setActiveLayout('TABLE_FOCUS');
    } else if (!isSidebarVisible && currentLayout.table === 30 && currentLayout.details === 70) {
      setActiveLayout('DETAILS_FOCUS');
    } else if (isSidebarVisible && !isDetailsVisible) {
      setActiveLayout('SIDEBAR_TABLE_ONLY');
    } else if (isSidebarVisible) {
      setActiveLayout('DEFAULT');
    }
  }, [currentLayout, isSidebarVisible, isDetailsVisible]);

  // Function to handle layout changes
  const handleLayoutChange = (layoutName: string) => {
    console.log('Setting layout to:', layoutName);

    // Apply layout directly through context
    setLayoutConfig(layoutName);

    // Also update local state
    setActiveLayout(layoutName);

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentLayout', layoutName);
    }
  };

  // Function to get opacity based on active layout
  const getOpacity = (layout: string) => {
    return activeLayout === layout ? 'opacity-100' : 'opacity-50 hover:opacity-70';
  };

  return (
    <div className={`mb-3 flex h-full items-center justify-between gap-4`}>
      <div className={`z-50 flex h-full items-center justify-start gap-2 pl-5`}>
        {/* Layout Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="text-base-content/60"
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="88"
                y1="40"
                x2="88"
                y2="216"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="168"
                y1="40"
                x2="168"
                y2="216"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <rect
                x="32"
                y="40"
                width="192"
                height="176"
                rx="8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></rect>
            </svg>
          </div>
          <ul className="dropdown-content menu bg-base-100 rounded-box left-0 z-[999] w-[280px] p-2 shadow">
            <li className="mb-1">
              <button onClick={() => handleLayoutChange('DEFAULT')} className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex h-[22px] w-[164px] rounded overflow-hidden ${getOpacity('DEFAULT')}`}>
                    <div className="bg-success h-full w-4"></div>
                    <div className="flex flex-col justify-center items-center bg-info h-full w-9 gap-1">
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                    </div>
                    <div className="bg-warning h-full w-11 flex items-center justify-center rounded-r"></div>
                  </div>
                  <span className={`text-xs text-base-content/40`}>
                    {activeLayout === 'DEFAULT' ? 'Active' : ''}
                  </span>
                </div>
              </button>
            </li>
            <li className="mb-1">
              <button onClick={() => handleLayoutChange('NO_SIDEBAR')} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-[22px] w-[84px] rounded overflow-hidden ${getOpacity('NO_SIDEBAR')}`}>
                    <div className="flex flex-col justify-center items-center bg-info h-full flex-1 gap-1">
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                    </div>
                    <div className="bg-warning h-full flex-1 flex items-center justify-center rounded-r"></div>
                  </div>
                  <span className={`text-xs text-base-content/40`}>
                    {activeLayout === 'NO_SIDEBAR' ? 'Active' : ''}
                  </span>
                </div>
              </button>
            </li>
            <li className="mb-1">
              <button onClick={() => handleLayoutChange('TABLE_FOCUS')} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-[22px] w-[94px] rounded overflow-hidden ${getOpacity('TABLE_FOCUS')}`}>
                    <div className="flex flex-col justify-center items-center bg-info h-full w-16 gap-1">
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                    </div>
                    <div className="bg-warning h-full w-8 flex items-center justify-center rounded-r"></div>
                  </div>
                  <span className={`text-xs text-base-content/40`}>
                    {activeLayout === 'TABLE_FOCUS' ? 'Active' : ''}
                  </span>
                </div>
              </button>
            </li>
            <li className="mb-1">
              <button onClick={() => handleLayoutChange('DETAILS_FOCUS')} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-[22px] w-[85px] rounded overflow-hidden ${getOpacity('DETAILS_FOCUS')}`}>
                    <div className="flex flex-col justify-center items-center bg-info h-full w-9 gap-1">
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                    </div>
                    <div className="bg-warning h-full w-20 flex items-center justify-center rounded-r"></div>
                  </div>
                  <span className={`text-xs text-base-content/40`}>
                    {activeLayout === 'DETAILS_FOCUS' ? 'Active' : ''}
                  </span>
                </div>
              </button>
            </li>
            <li>
              <button onClick={() => handleLayoutChange('SIDEBAR_TABLE_ONLY')} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-[22px] w-[84px] rounded overflow-hidden ${getOpacity('SIDEBAR_TABLE_ONLY')}`}>
                    <div className="bg-success h-full w-5"></div>
                    <div className="flex flex-col justify-center items-center bg-info h-full w-22 gap-1">
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                      <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                    </div>
                  </div>
                  <span className={`text-xs text-base-content/40`}>
                    {activeLayout === 'SIDEBAR_TABLE_ONLY' ? 'Active' : ''}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <div className={`flex w-full items-center pr-10`}>
          <MagnifyingGlass className={`text-base-content/40`} size={20} />
          <input
            name={`client-search`}
            type="text"
            onChange={(e) => {
              setSelectedFepLeft((prev) => ({
                ...prev,
                searchTerm: e.target.value
              }));
            }}
            value={selectedFepLeft.searchTerm}
            placeholder="Search by name..."
            className="input bg-warning/15 border-base-content/20 absolute right-0 left-12 z-20 cursor-pointer rounded-full border-1 pl-10 shadow-none ring-0 outline-none focus:bg-transparent focus:ring-0 focus:outline-0"
          />
          <XCircle
            onClick={() => {
              setSelectedFepLeft((prevState) => ({
                ...prevState,
                searchTerm: ''
              }));
            }}
            className={`absolute left-3/5 z-40 cursor-pointer ${selectedFepLeft.searchTerm !== '' ? 'visible' : 'hidden'}`}
            size={26}
            color={`white`}
          />
        </div>
      </div>
      <div
        className={`search-under-filter -z-20 cursor-pointer ${filterOpen ? 'translate-y-[79px]' : '-translate-y-[84px]'}`}
      >
        <div className="flex items-center justify-end gap-1 filter">
          <input
            onClick={() => setViewMode('')}
            className="btn lg:btn-xs btn-sm btn-success btn-soft filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="All"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="A-Z"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Latest"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Grouped"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Pinned"
          />
        </div>
      </div>
    </div>
  );
}

SearchField.displayName = 'SearchField';

export default SearchField;
import React, { useEffect, useState } from 'react';
import { useFepsLeft } from '@/contexts/FepsLeftContext';
import { useLayout } from '@/contexts/LayoutContext';
import LayoutChangeButton from '@/components/LayoutChangeButton';
import { ClientViewToggles } from '@/components/ClientViewToggles';

function SearchField() {
  const { setSelectedFepLeft } = useFepsLeft();
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

  return (
    <div className=" sticky top-0 z-50 flex h-[80px] items-center justify-between py-4 w-full min-w-full ">
      <div className={`z-50 flex h-full items-center justify-between gap-4 w-full min-w-full`}>
        {/* Layout Dropdown */}
        <LayoutChangeButton activeLayout={activeLayout} setLayoutConfig={setLayoutConfig}
                            setActiveLayout={setActiveLayout} />

        <label className="input rounded-full ml-2 w-full bg-base-content/5"
               htmlFor="client-search" style={{ width: '100%' }}>
          <svg className="h-[2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input id={`client-search`} type="search" className="grow rounded-full w-full" placeholder="Search"
                 onChange={(e) => {
            setSelectedFepLeft((prev) => ({
              ...prev,
              searchTerm: e.target.value
            }));
          }} />
        </label>
        <ClientViewToggles />
      </div>
    </div>
  );
}

SearchField.displayName = 'SearchField';

export default SearchField;
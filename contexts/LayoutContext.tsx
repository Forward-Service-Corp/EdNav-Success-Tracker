"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define layout configuration type
type LayoutConfig = {
  sidebar: number;
  table: number;
  details: number;
};

// Define a context type
type LayoutContextType = {
  currentLayout: LayoutConfig;
  setLayoutConfig: (configName: string) => void;
  toggleSidebar: () => void;
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDetailsVisible: boolean;
  setIsDetailsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// Define the possible layout configurations
// Sidebar is now fixed at 230 px width, but we use these values for sidebar visibility
export const LAYOUT_CONFIGS: { [key: string]: LayoutConfig } = {
  DEFAULT: { sidebar: 230, table: 40, details: 55 },
  NO_SIDEBAR: { sidebar: 0, table: 50, details: 50 }, // all td are visible
  TABLE_FOCUS: { sidebar: 0, table: 70, details: 30 },
  DETAILS_FOCUS: { sidebar: 0, table: 30, details: 70 },
  NARROW: { sidebar: 0, table: 40, details: 60 },
  MEDIUM_WITH_SIDEBAR: { sidebar: 230, table: 45, details: 55 },
  MEDIUM_NO_SIDEBAR: { sidebar: 0, table: 45, details: 55 },
  COMPACT: { sidebar: 230, table: 30, details: 70 },
  SIDEBAR_TABLE_ONLY: { sidebar: 15, table: 85, details: 0 }
};

// Create context with default values
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Provider props type
type LayoutProviderProps = {
  children: ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [currentLayout, setCurrentLayout] = useState<LayoutConfig>(
    LAYOUT_CONFIGS.DEFAULT,
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(true);

  // Change to a predefined layout configuration
  const setLayoutConfig = (configName: string) => {
    if (LAYOUT_CONFIGS[configName]) {
      // Set a small timeout to ensure the state updates are processed
      setTimeout(() => {
        setCurrentLayout(LAYOUT_CONFIGS[configName]);
        setIsSidebarVisible(LAYOUT_CONFIGS[configName].sidebar > 0);
        setIsDetailsVisible(LAYOUT_CONFIGS[configName].details > 0);

        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('currentLayout', configName);
            // console.log('Layout saved to localStorage:', configName);
          } catch (e) {
            console.error('Error saving layout to localStorage:', e);
          }
        }
      }, 0);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);

    if (!newVisibility) {
      // If hiding sidebar, switch to a no-sidebar layout
      setLayoutConfig("NO_SIDEBAR");
    } else {
      // If showing a sidebar, switch to the default layout
      setLayoutConfig("DEFAULT");
    }
  };

  // Initialize layout based on saved config or screen size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set up an event listener for localStorage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'currentLayout' && e.newValue) {
          // console.log('Layout changed in storage:', e.newValue);
          if (LAYOUT_CONFIGS[e.newValue]) {
            setCurrentLayout(LAYOUT_CONFIGS[e.newValue]);
            setIsSidebarVisible(LAYOUT_CONFIGS[e.newValue].sidebar > 0);
            setIsDetailsVisible(LAYOUT_CONFIGS[e.newValue].details > 0);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Try to get a saved layout
      const savedLayout = localStorage.getItem('currentLayout');

      if (savedLayout && LAYOUT_CONFIGS[savedLayout]) {
        // Use a saved layout if available
        // console.log('Restoring saved layout:', savedLayout);
        setCurrentLayout(LAYOUT_CONFIGS[savedLayout]);
        setIsSidebarVisible(LAYOUT_CONFIGS[savedLayout].sidebar > 0);
        setIsDetailsVisible(LAYOUT_CONFIGS[savedLayout].details > 0);
      } else {
        // Otherwise, adapt to screen size
        const width = window.innerWidth;

        if (width < 768) {
          // Mobile/small tablet - focus on table with minimal details
          setCurrentLayout(LAYOUT_CONFIGS.NARROW);
          setIsSidebarVisible(LAYOUT_CONFIGS.NARROW.sidebar > 0);
          setIsDetailsVisible(LAYOUT_CONFIGS.NARROW.details > 0);
        } else if (width < 1024) {
          // Tablet - no sidebar
          setCurrentLayout(LAYOUT_CONFIGS.MEDIUM_NO_SIDEBAR);
          setIsSidebarVisible(LAYOUT_CONFIGS.MEDIUM_NO_SIDEBAR.sidebar > 0);
          setIsDetailsVisible(LAYOUT_CONFIGS.MEDIUM_NO_SIDEBAR.details > 0);
        } else {
          // Desktop - default layout
          setCurrentLayout(LAYOUT_CONFIGS.DEFAULT);
          setIsSidebarVisible(LAYOUT_CONFIGS.DEFAULT.sidebar > 0);
          setIsDetailsVisible(LAYOUT_CONFIGS.DEFAULT.details > 0);
        }
      }

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  // Adjust layout based on panel visibility
  useEffect(() => {
    if (!isSidebarVisible && !isDetailsVisible) {
      // If both sidebar and details are hidden, show the full table
      setCurrentLayout({ sidebar: 0, table: 100, details: 0 });
    } else if (!isSidebarVisible && isDetailsVisible) {
      // If only the sidebar is hidden, show table and details
      setCurrentLayout(LAYOUT_CONFIGS.NO_SIDEBAR);
    } else if (isSidebarVisible && !isDetailsVisible) {
      // If only details is hidden, use the sidebar table only layout
      setCurrentLayout(LAYOUT_CONFIGS.SIDEBAR_TABLE_ONLY);
    } else if (isSidebarVisible && isDetailsVisible) {
      // If both are visible, ensure we're using the DEFAULT layout
      // (but keep the current layout if it's one with a sidebar)
      if (currentLayout.sidebar === 0) {
        setCurrentLayout(LAYOUT_CONFIGS.DEFAULT);
      }
    }
  }, [isSidebarVisible, isDetailsVisible, currentLayout.sidebar]);

  const contextValue: LayoutContextType = {
    currentLayout,
    setLayoutConfig,
    toggleSidebar,
    isSidebarVisible,
    setIsSidebarVisible,
    isDetailsVisible,
    setIsDetailsVisible,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook for consuming context
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
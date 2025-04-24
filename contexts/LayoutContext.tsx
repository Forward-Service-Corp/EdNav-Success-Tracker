"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define layout configuration type
type LayoutConfig = {
  sidebar: number;
  table: number;
  details: number;
};

// Define context type
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
export const LAYOUT_CONFIGS: { [key: string]: LayoutConfig } = {
  DEFAULT: { sidebar: 15, table: 35, details: 50 },
  NO_SIDEBAR: { sidebar: 0, table: 50, details: 50 },
  TABLE_FOCUS: { sidebar: 0, table: 70, details: 30 },
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
      setCurrentLayout(LAYOUT_CONFIGS[configName]);
      setIsSidebarVisible(LAYOUT_CONFIGS[configName].sidebar > 0);
      setIsDetailsVisible(LAYOUT_CONFIGS[configName].details > 0);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // If sidebar is visible, switch to a no-sidebar layout
      setLayoutConfig("NO_SIDEBAR");
    } else {
      // If sidebar is hidden, switch to default layout
      setLayoutConfig("DEFAULT");
    }
  };

  // Adjust layout based on panel visibility
  useEffect(() => {
    if (!isSidebarVisible && !isDetailsVisible) {
      // If both sidebar and details are hidden, show full table
      setCurrentLayout({ sidebar: 0, table: 100, details: 0 });
    } else if (!isSidebarVisible && isDetailsVisible) {
      // If only sidebar is hidden, show table and details
      setCurrentLayout(LAYOUT_CONFIGS.NO_SIDEBAR);
    } else if (isSidebarVisible && !isDetailsVisible) {
      // If only details is hidden, show sidebar and table
      setCurrentLayout({ sidebar: 15, table: 85, details: 0 });
    }
  }, [isSidebarVisible, isDetailsVisible]);

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

"use client";

import { useLayout } from '@/contexts/LayoutContext';
import { ReactNode, useEffect } from 'react';

type AppLayoutProps = {
  sidebarContent: ReactNode;
  tableContent: ReactNode;
  detailsContent: ReactNode;
  initialLayout?: string;
};

export default function AppLayout({
  sidebarContent,
  tableContent,
  detailsContent,
  initialLayout = "DEFAULT",
}: AppLayoutProps) {
  const { currentLayout, setLayoutConfig, isSidebarVisible, isDetailsVisible } =
    useLayout();

  // Set initial layout configuration
  useEffect(() => {
    // Only set initial layout if no layout is already saved
    if (typeof window !== 'undefined') {
      const savedLayout = localStorage.getItem('currentLayout');
      if (!savedLayout || savedLayout === '') {
        setLayoutConfig(initialLayout);
      }
    }
  }, [initialLayout, setLayoutConfig]);

  // Calculate panel styles based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: isSidebarVisible ? '230px' : '0', // Fixed 230px width
        maxWidth: isSidebarVisible ? '230px' : '0',
        display: isSidebarVisible ? "block" : "none",
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
      table: {
        width: `${currentLayout.table}%`,
        maxWidth: `${currentLayout.table}%`,
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
      details: {
        width: `${currentLayout.details}%`,
        maxWidth: `${currentLayout.details}%`,
        display: isDetailsVisible ? "block" : "none",
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
    };
  };

  const styles = getPanelStyles();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar Panel */}
      {isSidebarVisible && (
        <div
          className="h-full overflow-hidden border-r border-base-300"
          style={styles.sidebar}
        >
          {sidebarContent}
        </div>
      )}

      {/* Table Panel */}
      <div
        className="h-full overflow-hidden"
        style={styles.table}
      >
        {tableContent}
      </div>

      {/* Details Panel */}
      {isDetailsVisible && (
        <div className="h-full overflow-hidden" style={styles.details}>
          {detailsContent}
        </div>
      )}
    </div>
  );
}
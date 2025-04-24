"use client";

import { useLayout } from "@/contexts/LayoutContext";
import { ReactNode, useEffect } from "react";

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
    setLayoutConfig(initialLayout);
  }, [initialLayout, setLayoutConfig]);

  // Calculate panel styles based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: `${currentLayout.sidebar}%`,
        maxWidth: `${currentLayout.sidebar}%`,
        display: isSidebarVisible ? "block" : "none",
        transition: "width 0.3s ease-in-out, max-width 0.3s ease-in-out",
      },
      table: {
        width: `${currentLayout.table}%`,
        maxWidth: `${currentLayout.table}%`,
        transition: "width 0.3s ease-in-out, max-width 0.3s ease-in-out",
      },
      details: {
        width: `${currentLayout.details}%`,
        maxWidth: `${currentLayout.details}%`,
        display: isDetailsVisible ? "block" : "none",
        transition: "width 0.3s ease-in-out, max-width 0.3s ease-in-out",
      },
    };
  };

  const styles = getPanelStyles();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar Panel */}
      {isSidebarVisible && (
        <div
          className="border-base-300 h-full overflow-hidden border-r"
          style={styles.sidebar}
        >
          {sidebarContent}
        </div>
      )}

      {/* Table Panel */}
      <div
        className="border-base-300 h-full overflow-hidden border-r"
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

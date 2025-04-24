"use client";

import { useEffect, useState } from "react";
import { LayoutProvider } from "@/contexts/LayoutContext";
import AppLayout from "@/components/AppLayout";
import LayoutControls from "@/components/LayoutControls";
import ClientTableNew from "@/components/ClientTableNew";
import ClientProfile from "@/components/ClientProfile";
import { EditingProvider } from "@/contexts/EditingContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { ClientListProvider } from "@/contexts/ClientListContext";
import { NavigatorsProvider } from "@/contexts/NavigatorsContext";
import { FepsLeftProvider } from "@/contexts/FepsLeftContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import FilterSidebar from "@/components/FilterSidebar";

export default function Dashboard() {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <NotificationProvider>
      <EditingProvider>
        <ClientListProvider>
          <ClientsProvider>
            <ActivityProvider>
              <NavigatorsProvider>
                <FepsLeftProvider>
                  <LayoutProvider>
                    <div className="bg-base-100 flex h-screen flex-col">
                      {/* Layout Controls */}
                      <LayoutControls />

                      {/* Main Layout */}
                      <div className="flex-1 overflow-hidden">
                        <AppLayout
                          sidebarContent={
                            <FilterSidebar
                              menuOpen={menuOpen}
                              setMenuOpen={setMenuOpen}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                          tableContent={
                            <ClientTableNew
                              menuOpen={menuOpen}
                              setMenuOpen={setMenuOpen}
                              toggleSidebar={toggleSidebar}
                              setOpenPanel={setSelectedPanel}
                            />
                          }
                          detailsContent={
                            selectedPanel === "profile" ? (
                              <ClientProfile setOpenPanel={setSelectedPanel} />
                            ) : (
                              <div className="text-base-content flex h-full items-center justify-center opacity-50">
                                <div className="text-center">
                                  <h3 className="text-lg font-medium">
                                    No Client Selected
                                  </h3>
                                  <p>
                                    Select a client from the table to view
                                    details
                                  </p>
                                </div>
                              </div>
                            )
                          }
                        />
                      </div>
                    </div>
                  </LayoutProvider>
                </FepsLeftProvider>
              </NavigatorsProvider>
            </ActivityProvider>
          </ClientsProvider>
        </ClientListProvider>
      </EditingProvider>
    </NotificationProvider>
  );
}
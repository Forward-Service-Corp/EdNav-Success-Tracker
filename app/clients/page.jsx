"use client";
import { useEffect, useState } from 'react';
import AddClientForm from '../../components/AddClientForm';
import ClientTableNew from '../../components/ClientTableNew';
import ClientProfile from '../../components/ClientProfile';
import FilterSelectRadios from '../../components/FilterSelectRadios';
import FilterSelectRadiosAge from '../../components/FilterSelectRadiosAge';
import Logo from '../../components/Logo';
import NavigatorSelector from '../../components/NavigatorSelector';
import { useClients } from '../../contexts/ClientsContext';
import { useLoading } from '../../contexts/LoadingContext';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { LayoutProvider } from '../../contexts/LayoutContext';

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { selectedClient } = useClients();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setOpenPanel("profile");
    }
  }, [selectedClient]);

  return (
    <LayoutProvider>
      <ClientsPageContent
        openPanel={openPanel}
        setOpenPanel={setOpenPanel}
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
      />
    </LayoutProvider>
  );
}

// Separate component that can access the LayoutProvider
function ClientsPageContent({ openPanel, setOpenPanel, setMenuOpen, menuOpen }) {
  // Import useLayout within the component
  const { useLayout } = require('../../contexts/LayoutContext');
  const {
    currentLayout,
    setLayoutConfig,
    isSidebarVisible,
    isDetailsVisible,
    toggleSidebar
  } = useLayout();

  // Direct panel styling based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: isSidebarVisible ? '230px' : '0', // Fixed 230px width
        maxWidth: isSidebarVisible ? '230px' : '0',
        display: isSidebarVisible ? 'block' : 'none',
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
        display: isDetailsVisible ? 'block' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    };
  };

  const styles = getPanelStyles();

  // Monitor localStorage for layout changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentLayout' && e.newValue) {
        console.log('Layout changed in storage:', e.newValue);
        setLayoutConfig(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setLayoutConfig]);

  // Update layout when a panel changes
  useEffect(() => {
    if (openPanel === 'profile' && !isDetailsVisible) {
      // If a profile panel is opened but a details panel is hidden, show it
      setLayoutConfig(isSidebarVisible ? 'DEFAULT' : 'NO_SIDEBAR');
    }
  }, [openPanel, isDetailsVisible, isSidebarVisible, setLayoutConfig]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex flex-1 gap-2 p-2 overflow-hidden">
        {/* Sidebar Panel */}
        {isSidebarVisible && (
          <div
            className="bg-base-300 flex flex-col items-center justify-start gap-4 overflow-hidden h-full"
            style={styles.sidebar}
          >
            <Logo />
            <div
              className={`text-base-content/40 mx-4 box-border flex w-full flex-col gap-4 pr-4 pl-4 md:pr-12 md:pl-10`}
            >
              <div className="divider mt-8 mb-3">Age Filters</div>
              <FilterSelectRadiosAge />
            </div>
            <div
              className={`text-base-content/40 mx-4 box-border flex w-full flex-col gap-4 pr-4 pl-4 md:pr-12 md:pl-10`}
            >
              <div className="divider mt-8">Status Filters</div>
              <FilterSelectRadios />
            </div>

            <div className="sticky bottom-0 left-0 mt-auto p-6 w-full space-y-6">
              <ThemeSwitcher />
              <NavigatorSelector />
            </div>
          </div>
        )}

        {/* Table Panel */}
        <div
          className="overflow-hidden h-full"
          style={styles.table}
        >
          <ClientTableNew
            setOpenPanel={setOpenPanel}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Details Panel */}
        {isDetailsVisible && (
          <div
            className="overflow-hidden h-full"
            style={styles.details}
          >
            {openPanel === 'profile' ? (
              <ClientProfile setOpenPanel={setOpenPanel} />
            ) : openPanel === 'form' ? (
              <div className="h-full">
                <AddClientForm setOpenPanel={setOpenPanel} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-base-content/50 text-center">
                  <p className="text-lg font-medium">Select a client</p>
                  <p>Choose a client from the table to view details</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientsPage;
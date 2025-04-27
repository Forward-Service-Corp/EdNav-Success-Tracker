"use client";
import { useEffect, useState } from 'react';
import { useClient } from '../../contexts/ClientContext';
import { useLoading } from '../../contexts/LoadingContext';
import { LayoutProvider } from '../../contexts/LayoutContext';
import AddClientForm from '../../components/AddClientForm';
import ClientTable from '../../components/ClientTable';
import ClientProfile from '../../components/ClientProfile';
import FilterSelectRadios from '../../components/FilterSelectRadios';
import FilterSelectRadiosAge from '../../components/FilterSelectRadiosAge';
import NavigatorSelector from '../../components/NavigatorSelector';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import DashboardContainer from '../../components/DashboardContainer';

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const { selectedClient } = useClient();
  const [openPanel, setOpenPanel] = useState(null);
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
        width: isSidebarVisible ? '230px' : '0', // Fixed 230 px width
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
        // console.log('Layout changed in storage:', e.newValue);
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
    <div className="flex h-screen w-screen bg-base-300">
      <div className="flex flex-1 gap-5 p-5 overflow-hidden">
        {/* Sidebar Panel */}
        {isSidebarVisible && (
          <div
            className="bg-base-100 rounded flex-none flex flex-col p-5 pt-2 items-center justify-start gap-5 h-full relative"
            style={styles.sidebar}
          >
            <Logo />
            <div
              className={`text-base-content box-border flex w-full flex-col gap-4 mt-5 `}
            >
              <div className="divider mt-8 mb-3">Age Filters</div>
              <FilterSelectRadiosAge />
            </div>
            <div
              className={`text-base-content/40 box-border flex w-full flex-col gap-4 `}
            >
              <div className="divider mt-8">Status Filters</div>
              <FilterSelectRadios />
            </div>

            <div
              className=" flex flex-col mt-8 items-center border-t border-base-content/10 gap-6 py-6">
              <ThemeSwitcher />
              <NavigatorSelector />
              <Button use="primary" label="+ Add Client" onClick={() => setOpenPanel('form')}
                      customStyle={`w-[180px]`} />
              <Button use="secondary" label="Logout" onClick={() => setOpenPanel('form')} customStyle={`w-[180px]`} />
            </div>
          </div>
        )}

        {/* Table Panel */}
        <div
          className="overflow-hidden h-full rounded-b"
          // style={styles.table}
        >
          <ClientTable
            setOpenPanel={setOpenPanel}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Details Panel */}
        {isDetailsVisible && (
          <div
            className=" h-full"
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
                <DashboardContainer />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientsPage;
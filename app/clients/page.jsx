'use client';
import { useEffect, useState } from 'react';
import { useClient } from '../../contexts/ClientContext';
import { useLoading } from '../../contexts/LoadingContext';
import { LayoutProvider } from '../../contexts/LayoutContext';
import AddClientForm from '../../components/AddClientForm';
import ClientTable from '../../components/ClientTable';
import ClientProfile from '../../components/ClientProfile';
import DashboardContainer from '../../components/DashboardContainer';
import Sidebar from '../../components/Sidebar';

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
      setOpenPanel('profile');
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
function ClientsPageContent({ setMenuOpen, menuOpen }) {
  const [openPanel, setOpenPanel] = useState('');
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
          <Sidebar setOpenPanel={setOpenPanel} setMenuOpen={setMenuOpen} menuOpen={menuOpen}
                   toggleSidebar={toggleSidebar} />
        )}

        {/* Table Panel */}
        <div className="w-full h-full rounded-b">
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
              <AddClientForm setOpenPanel={setOpenPanel} />
            ) : (

              <DashboardContainer />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientsPage;
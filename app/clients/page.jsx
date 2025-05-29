"use client";
import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { LayoutProvider } from "../../contexts/LayoutContext";
import { useSession } from "next-auth/react";
import AddClientForm from "../../components/AddClientForm";
import ClientTable from "../../components/ClientTable";
import ClientProfile from "../../components/ClientProfile";
import DashboardContainer from "../../components/DashboardContainer";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <LayoutProvider>
      <ClientsPageContent
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
        open={open}
        setOpen={setOpen}
      />
    </LayoutProvider>
  );
}

// Separate component that can access the LayoutProvider
function ClientsPageContent({ setMenuOpen, menuOpen, open, setOpen }) {
  const { useLayout } = require("../../contexts/LayoutContext");
  const { data: session } = useSession();
  const router = useRouter();
  const {
    currentLayout,
    setLayoutConfig,
    isSidebarVisible,
    isDetailsVisible,
    toggleSidebar,
  } = useLayout();
  // Direct panel styling based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: isSidebarVisible ? "230px" : "0", // Fixed 230 px width
        maxWidth: isSidebarVisible ? "230px" : "0",
        display: isSidebarVisible ? "block" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      table: {
        width: `${currentLayout.table}%`,
        maxWidth: `${currentLayout.table}%`,
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      details: {
        width: `${currentLayout.details}%`,
        maxWidth: `${currentLayout.details}%`,
        display: isDetailsVisible ? "block" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
    };
  };

  const styles = getPanelStyles();

  // Monitor localStorage for layout changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "currentLayout" && e.newValue) {
        // console.log('Layout changed in storage:', e.newValue);
        setLayoutConfig(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setLayoutConfig]);

  // Update layout when a panel changes
  useEffect(() => {
    if (open === "profile" && !isDetailsVisible) {
      // If a profile panel is opened but a details panel is hidden, show it
      setLayoutConfig(isSidebarVisible ? "DEFAULT" : "NO_SIDEBAR");
    }
  }, [isDetailsVisible, isSidebarVisible, setLayoutConfig]);

  useEffect(() => {
    if (!session) {
      return router.push("/login");
    }
  }, [session, router]);

  return (
    <div className="bg-base-300 flex h-screen w-screen">
      <div className="flex flex-1 gap-5 overflow-hidden p-5">
        {/* Sidebar Panel */}
        {isSidebarVisible && (
          <Sidebar
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            toggleSidebar={toggleSidebar}
            setOpen={setOpen}
            open={open}
          />
        )}

        {/* Table Panel */}
        <div className="h-full" style={styles.table}>
          <ClientTable
            setOpen={setOpen}
            open={open}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Details Panel */}
        {isDetailsVisible && (
          <div className="h-full" style={styles.details}>
            {open === "profile" ? (
              <ClientProfile />
            ) : open === "form" ? (
              <AddClientForm setOpen={setOpen} />
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
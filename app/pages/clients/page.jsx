"use client";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import { useClients } from "../../../contexts/ClientsContext";
import AddClientForm from "../../../components/AddClientForm";
import ClientProfile from "../../../components/ClientProfile";
import ClientTableNew from "../../../components/ClientTableNew";
import Sidebar from "../../../components/Sidebar";

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { selectedClient } = useClients();
  const [, setViewMode] = useState("");
  const [, setStatusCollapse] = useState(null);
  const [menuOpen, setMenuOpen] = useState();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setOpenPanel("profile");
    }
  }, [selectedClient]);

  const toggleGrouped = () => {
    setViewMode("grouped");
    setStatusCollapse([]);
  };

  const togglePinned = () => {
    setViewMode("pinned");
    setStatusCollapse([]);
  };

  const toggleAlpha = () => {
    setViewMode("alpha");
    setStatusCollapse([]);
  };

  const toggleDate = () => {
    setViewMode("date");
    setStatusCollapse([]);
  };

  return (
    <div className="flex h-screen w-screen gap-2 overflow-hidden p-2">
      <div
        className={`bg-base-200 max-w-[240px] ${menuOpen ? "flex-[1]" : "flex-[0]"}`}
      >
        <Sidebar setOpenPanel={setOpenPanel} />
      </div>
      <div className={`bg-base-100 ${menuOpen ? "flex-[1]" : "flex-[2]"}`}>
        <ClientTableNew setOpenPanel={setOpenPanel} setMenuOpen={setMenuOpen} />
      </div>
      {openPanel === "profile" ? (
        <div className="bg-base-100 flex-[2]">
          <ClientProfile setOpenPanel={setOpenPanel} />
        </div>
      ) : openPanel === "form" ? (
        <div className="bg-base-200 min-w-[150px] flex-[3]">
          <AddClientForm setOpenPanel={setOpenPanel} />
        </div>
      ) : null}
    </div>
  );
}

export default ClientsPage;

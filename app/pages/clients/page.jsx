"use client";
import { useEffect, useState } from "react";
import AddClientForm from "../../../components/AddClientForm";
import ClientProfile from "../../../components/ClientProfile";
import ClientTableNew from "../../../components/ClientTableNew";
import Sidebar from "../../../components/Sidebar";
import { useLoading } from "../../../contexts/LoadingContext";
import { useClients } from "../../../contexts/ClientsContext";

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { selectedClient } = useClients();

  useEffect(() => {
    console.log("loading");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setOpenPanel("profile");
    }
  }, [selectedClient]);

  return (
    <div className="flex h-screen w-screen gap-2 overflow-hidden p-2">
      <div className="bg-base-200 max-w-[240px] flex-[1]">
        <Sidebar setOpenPanel={setOpenPanel} />
      </div>
      <div className="bg-base-100 max-w-[450px] flex-[1]">
        <ClientTableNew setOpenPanel={setOpenPanel} />
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

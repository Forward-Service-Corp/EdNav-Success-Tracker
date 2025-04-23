"use client";
import { useEffect, useState } from "react";
import AddClientForm from "../../../components/AddClientForm";
import ClientTableNew from "../../../components/BKP_ClientTableNew";
import ClientProfile from "../../../components/ClientProfile";
import FilterSelectRadios from "../../../components/FilterSelectRadios";
import FilterSelectRadiosAge from "../../../components/FilterSelectRadiosAge";
import Logo from "../../../components/Logo";
import NavigatorSelector from "../../../components/NavigatorSelector";
import { useClients } from "../../../contexts/ClientsContext";
import { useLoading } from "../../../contexts/LoadingContext";
import ThemeSwitcher from "../../../components/ThemeSwitcher";

function ClientsPage() {
  const { setLoading } = useLoading(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { selectedClient } = useClients();
  const [, setMenuOpen] = useState();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setOpenPanel("profile");
    }
  }, [selectedClient]);

  return (
    <div className="flex h-screen w-screen gap-2 p-2">
      <div
        className={`bg-base-200 flex w-full max-w-[265px] flex-col items-center justify-start gap-4`}
      >
        <Logo />
        <div
          className={`text-base-content/40 mx-4 box-border flex w-full flex-col gap-4 pr-12 pl-10`}
        >
          <div className="divider mt-8 mb-3">Age Filters</div>
          <FilterSelectRadiosAge />
        </div>
        <div
          className={`text-base-content/40 mx-4 box-border flex w-full flex-col gap-4 pr-12 pl-10`}
        >
          <div className="divider mt-8">Status Filters</div>
          <FilterSelectRadios />
        </div>
      </div>

      <div className={`bg-base-100 flex-[2]`}>
        {/*<div className={`bg-base-100 ${menuOpen ? "flex-[1]" : "flex-[2]"}`}>*/}
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
      <div
        className={`border-info/20 bg-base-300] absolute bottom-0 left-6 mx-6 h-1/2 w-[185px] space-y-6 border-t pt-6`}
      >
        <ThemeSwitcher />
        <NavigatorSelector />
      </div>
    </div>
  );
}

export default ClientsPage;

import React from "react";
import { XSquare } from "phosphor-react";
import { getBadgeColor } from "../lib/ColorMap";
import { useClients } from "/contexts/ClientsContext";
import ClientProfilePin from "./ClientProfilePin";
import { useEditing } from "../contexts/EditingContext";

export default function ClientProfileHeader() {
  const { selectedClient, setSelectedClient } = useClients();
  const { setEditing } = useEditing();

  return (
    <div
      className={`bg-base-200 sticky top-0 right-0 left-0 flex h-[80px] items-center justify-between px-3 py-4 shadow`}
    >
      <div className={`flex items-center gap-4`}>
        <ClientProfilePin />
        <div className={`text-xl`}>
          {selectedClient?.first_name + " " + selectedClient?.last_name}
        </div>

        <div className={`pr-4`}>
          <div className={`${getBadgeColor(selectedClient?.clientStatus)}`}>
            {selectedClient?.clientStatus}
          </div>
        </div>
      </div>

      <div
       ""nClick={() => {
          setEditing("");
          setSelectedClient(null);
        }}
        className={``}
      >
        <XSquare size={33} className={`text-base-content`} />
      </div>
    </div>
  );
}

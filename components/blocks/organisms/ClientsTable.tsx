// /components/blocks/organisms/ClientsTable.tsx

"use client";

import ClientTableBody from "../molecules/ClientTableBody";

type ClientsTableProps = {
  clients: any[];
  selectedClientId: string | null;
  setOpenPanel: (panel: string | null) => void;
};

export default function ClientsTable({
  clients,
  selectedClientId,
  setOpenPanel,
}: ClientsTableProps) {
  return (
    <div className="no-scrollbar w-full overflow-y-scroll">
      <table className="no-scrollbar sticky top-80 z-10 table w-full overflow-y-scroll">
        <ClientTableBody
          clients={clients}
          selectedClientId={selectedClientId}
          setOpenPanel={setOpenPanel}
        />
      </table>
    </div>
  );
}

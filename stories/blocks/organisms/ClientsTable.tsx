// /components/blocks/organisms/ClientsTable.tsx

"use client";

import ClientTableBody from "../molecules/ClientTableBody";

type ClientsTableProps = {
  clients: any[];
  selectedClientId: string | null;
  open?: (
    url?: string | URL,
    target?: string,
    features?: string,
  ) => WindowProxy | null;
  setOpen?: any;
};

// Define the component with a name before exporting
const ClientsTable = ({
  clients,
  selectedClientId,
  open,
  setOpe,
}: ClientsTableProps) => (
  <table className="no-scrollbar sticky top-80 z-10 table w-full min-w-full overflow-y-scroll">
    <ClientTableBody
      open={open}
      setOpen={setOpen}
      clients={clients}
      selectedClientId={selectedClientId}
    />
  </table>
);

// Set the display name explicitly (optional but good practice)
ClientsTable.displayName = "ClientsTable";

// Export the named component
export default ClientsTable;

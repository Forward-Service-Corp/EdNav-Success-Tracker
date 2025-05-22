// /components/blocks/organisms/ClientsTable.tsx

"use client";

import ClientTableBody from "../molecules/ClientTableBody";

type ClientsTableProps = {
  clients: any[];
  selectedClientId: string | null;
};

// Define the component with a name before exporting
const ClientsTable = ({
                        clients,
                        selectedClientId,
                      }: ClientsTableProps) => (
  <table className="no-scrollbar sticky top-80 z-10 table min-w-full w-full overflow-y-scroll">
    <ClientTableBody
      clients={clients}
      selectedClientId={selectedClientId}
    />
  </table>
);

// Set the display name explicitly (optional but good practice)
ClientsTable.displayName = 'ClientsTable';

// Export the named component
export default ClientsTable;

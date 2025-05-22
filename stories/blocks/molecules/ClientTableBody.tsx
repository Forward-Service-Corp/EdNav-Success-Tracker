// /components/blocks/molecules/ClientTableBody.tsx

import { useFepsLeft } from "@/contexts/FepsLeftContext";
import ClientRow from "@/stories/blocks/molecules/ClientRow";
import React, { useState } from "react";

type ClientTableBodyProps = {
  clients: any[];
  selectedClientId: string | null;
  open?: (
    url?: string | URL,
    target?: string,
    features?: string,
  ) => WindowProxy | null;
  setOpen?: any;
};

export default function ClientTableBody({
  clients,
  open,
  setOpen,
  selectedClientI,
}: ClientTableBodyProps) {
  const { selectedFepLeft } = useFepsLeft();
  const { grouped, pinned } = selectedFepLeft;

  function groupByClientStatus(clients: any[]) {
    return clients.reduce((groups, client) => {
      const status = client.clientStatus.toLowerCase() || "Unknown";
      if (!groups[status]) groups[status] = [];
      groups[status].push(client);
      return groups;
    }, {});
  }

  function sortPinnedFirst(clients: any[]) {
    return [...clients].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }

  function groupAndSortClients(clients: any[]) {
    const grouped = groupByClientStatus(clients);
    for (const status in grouped) {
      grouped[status] = sortPinnedFirst(grouped[status]);
    }
    return grouped;
  }

  const groupedClients = grouped ? groupAndSortClients(clients) : {};
  const sortedClients = !grouped
    ? pinned
      ? sortPinnedFirst(clients)
      : clients
    : [];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  function toggleGroup(status: string) {
    setExpandedGroups((prev) => ({ ...prev, [status]: !prev[status] }));
  }

  if (!clients) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-base-content mt-4">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <tbody className="h-full min-h-[600px] min-w-full">
      {grouped
        ? Object.entries(groupedClients).map(([status, clients]) => (
            <React.Fragment key={status}>
              <tr
                className="bg-base-200 cursor-pointer"
                onClick={() => toggleGroup(status)}
              >
                <td colSpan={8} className="col-span-full py-2 font-bold">
                  {status}
                  <button
                    type="button"
                    className="ml-2 text-sm text-blue-500 underline"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(status);
                    }}
                  >
                    {expandedGroups[status] ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
              {expandedGroups[status] &&
                // @ts-ignore
                clients.map((client) => (
                  <ClientRow
                    open={open}
                    setOpen={setOpen}
                    key={client._id}
                    person={client}
                    selected={selectedClientId === client._id}
                  />
                ))}
            </React.Fragment>
          ))
        : sortedClients.map((client) => (
            <ClientRow
              open={open}
              setOpen={setOpen}
              key={client._id}
              person={client}
              selected={selectedClientId === client._id}
            />
          ))}
    </tbody>
  );
}

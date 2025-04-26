import React from 'react';
import { XSquare } from 'phosphor-react';
import { useClient } from '/contexts/ClientContext';
import ClientProfilePin from './ClientProfilePin';
import { useEditing } from '../contexts/EditingContext';
import Badge from './Badge';

export default function ClientProfileHeader({ setOpenPanel }) {
  const { selectedClient, setSelectedClient } = useClient();
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
          <Badge use={selectedClient?.clientStatus.toLowerCase()} />
        </div>
      </div>

      <div
        onClick={() => {
          setEditing("");
          setSelectedClient(null);
          setOpenPanel(false);
        }}
        className={``}
      >
        <XSquare size={33} className={`text-base-content`} />
      </div>
    </div>
  );
}

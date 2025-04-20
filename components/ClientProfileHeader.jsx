import React from 'react';
import { XSquare } from 'phosphor-react';
import { getBadgeColor } from '@/lib/ColorMap';
import { useClients } from '/contexts/ClientsContext';
import ClientProfilePin from './ClientProfilePin';
import { useEditing } from '@/contexts/EditingContext';

export default function ClientProfileHeader() {

  const { selectedClient, setSelectedClient } = useClients();
  const { editing, setEditing } = useEditing();

  return (
    <div className={`px-12 py-6 flex items-center justify-between sticky top-0 z-10 bg-base-300 shadow-lg`}>
      <div className={`flex items-center gap-4`}>
        <ClientProfilePin />
        <div
          className={`text-xl`}>{selectedClient && !selectedClient?.name ? selectedClient?.first_name + ' ' + selectedClient?.last_name : selectedClient?.name}</div>

        <div className={`pr-4`}>
          <div className={`${getBadgeColor(selectedClient?.clientStatus)}`}>{selectedClient?.clientStatus}</div>
        </div>
      </div>

      <div onClick={() => {
        setEditing('');
        setSelectedClient(null);
      }}
           className={``}>
        <XSquare size={33} className={`text-base-content`} />
      </div>
    </div>

  );
}

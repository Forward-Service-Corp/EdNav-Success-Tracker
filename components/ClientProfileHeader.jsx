import React from 'react';
import { XSquare } from 'phosphor-react';
import { getBadgeColor } from '@/lib/ColorMap';
import { useClients } from '/contexts/ClientsContext';
import ClientProfilePin from './ClientProfilePin';
import { useEditing } from '@/contexts/EditingContext';

export default function ClientProfileHeader() {

  const { selectedClient, setSelectedClient } = useClients();
  const { setEditing } = useEditing();

  return (
    <div
      className={`flex justify-between px-4 py-6 bg-base-300 gap-4 items-center divide-x divide-accent-content/30 fixed top-0 w-full z-50`}>
      <ClientProfilePin />
      <div
        className={`text-xl`}>{selectedClient && !selectedClient?.name ? selectedClient?.first_name + ' ' + selectedClient?.last_name : selectedClient?.name}</div>

      <div className={`pr-4`}>
        <div className={`${getBadgeColor(selectedClient?.clientStatus)}`}>{selectedClient?.clientStatus}</div>
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

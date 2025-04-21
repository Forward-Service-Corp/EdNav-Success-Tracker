'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useFepsLeft } from '/contexts/FepsLeftContext';
import ClientTableItem from '/components/ClientTableItem';
import { useNavigators } from '../contexts/NavigatorsContext';
import { useClientList } from '../contexts/ClientListContext';
import { Eye, EyeClosed } from 'phosphor-react';
import SearchField from './SearchField';
import { useClients } from '../contexts/ClientsContext';

export default function ClientTable({ menuOpen, setMenuOpen }) {
  const { clientList } = useClientList();
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft } = useFepsLeft();
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState([]);
  const { selectedClient } = useClients(null);

  const getBGColor = (status) => {
    switch (status) {
      case 'Inactive':
        return 'bg-error text-error-content';
      case 'In Progress':
        return 'bg-warning text-warning-content';
      case 'Active':
        return 'bg-success text-success-content';
      case 'graduated':
        return 'bg-info text-info-content';
      default:
        return 'bg-primary text-primary-content';
    }
  };

  const handleCollapseChange = (status) => {
    setStatusCollapse(prevState => {
      if (prevState.includes(status)) {
        return prevState.filter(item => item !== status);
      }
      return [...prevState, status];
    });
  };

  const filteredClients = clientList?.filter(client => {
    if (selectedNavigator?.name !== 'All') {
      return client.navigator === selectedNavigator?.name;
    }
    return client;
  }).filter(client => {
    const matchesSearch = client.first_name?.toLowerCase().includes(selectedFepLeft.searchTerm.toLowerCase())
      || client.last_name?.toLowerCase().includes(selectedFepLeft.searchTerm.toLowerCase());
    const matchesStatus = selectedFepLeft.status === 'All' || client.clientStatus === selectedFepLeft.status;
    const matchesGroup = selectedFepLeft.age === 'All' || client.group === selectedFepLeft.age;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const groupByClientStatus = (clients) => {
    return clients
      .filter(client => {
        if (selectedNavigator.name !== 'All') return client.navigator === selectedNavigator?.name;
        return client;
      })
      .sort((a, b) => (a.clientStatus > b.clientStatus ? 1 : -1))
      .reduce((groups, client) => {
        const status = client.clientStatus || 'Unknown';
        if (!groups[status]) groups[status] = [];
        groups[status].push(client);
        return groups;
      }, {});
  };

  const pinnedIds = selectedNavigator?.pinned || [];

  const clientsToShow = useMemo(() => {
    if (!filteredClients) return [];

    if (viewMode === 'pinned') {
      return [...filteredClients].sort((a, b) => {
        const aPinned = pinnedIds.includes(a._id.toString());
        const bPinned = pinnedIds.includes(b._id.toString());
        return aPinned === bPinned ? 0 : aPinned ? -1 : 1;
      });
    }

    if (viewMode === 'grouped') {
      return groupByClientStatus(filteredClients); // returns object
    }

    return filteredClients;
  }, [filteredClients, viewMode, pinnedIds]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;
  return (
    <div className={`relative h-full`}>
      <div
        className="h-[80px] shadow-lg sticky top-0 z-10 bg-base-100 w-full">
        <SearchField menuOpen={menuOpen} setMenuOpen={setMenuOpen} setFilterOpen={setFilterOpen}
                     filterOpen={filterOpen} setViewMode={setViewMode} setStatusCollapse={setStatusCollapse} />
      </div>
      <div className={`w-full h-full relative`}>
        <div className={`overflow-y-auto max-h-[calc(100vh-80px)] w-full no-scrollbar`}>
          <table className={`w-full ${!filterOpen ? '' : 'mt-[45px]'} table-auto`}>
            <thead className="w-full">
            <tr className="w-full text-left text-xs">
              <th className={`pl-6`}>
                Name
              </th>
              <th className={`${menuOpen ? 'hidden' : ''}`}>
                Last Activity
              </th>
              <th className={`${menuOpen ? 'hidden' : ''}`}>
                Group
              </th>
              <th className={`${menuOpen ? 'hidden' : ''}`}>
                FEP
              </th>
              <th className={`${menuOpen ? 'hidden' : ''}`}>
                Region
              </th>
              <th className={``}>
                Pin
              </th>
              <th className={`py-2 text-sm items-center cursor-pointer col-span-1`}>
                Status
              </th>
            </tr>
            </thead>
            <tbody className="w-full relative h-full">
            {viewMode === 'grouped' ? (
              Object.entries(clientsToShow).map(([status, clients], idx) => (
                <React.Fragment key={status}>
                  {/*<tr className={`${getBGColor(status)} ${statusCollapse.includes(status) ? 'hidden' : ''}`}>*/}
                  <tr className={`${getBGColor(status)}`} onClick={() => handleCollapseChange(status)}>
                    <td className={`py-2 text-sm items-center cursor-pointer`}>
                      <span className={`ml-6 font-bold`}>{status}</span></td>
                    <td className={`${menuOpen ? 'hidden' : ''}`}></td>
                    <td className={`${menuOpen ? 'hidden' : ''}`}></td>
                    <td className={`${menuOpen ? 'hidden' : ''}`}></td>
                    <td></td>
                    <td className={`align-middle`}>
                      {!statusCollapse.includes(status) ?
                        <Eye size={27} className={getBGColor(status)} /> :
                        <EyeClosed size={27} className={getBGColor(status)} />}
                    </td>
                  </tr>
                  {clients.map((person, i) => (
                    <ClientTableItem key={`${idx}-${i}`} person={person} i={i} statusCollapse={statusCollapse}
                                     menuOpen={menuOpen} filterOpen={filterOpen} />
                  ))}
                </React.Fragment>
              ))
            ) : (
              Array.isArray(clientsToShow) && clientsToShow.length > 0 ? (
                clientsToShow.map((person, i) => (
                  <ClientTableItem key={i} person={person} i={i} statusCollapse={statusCollapse}
                                   menuOpen={menuOpen} filterOpen={filterOpen} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

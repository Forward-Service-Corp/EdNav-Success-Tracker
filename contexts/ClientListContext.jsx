import React, { createContext, useContext, useEffect, useState } from 'react';
import { useClients } from './ClientsContext';

const ClientListContext = createContext();

export const ClientListProvider = ({ children }) => {
    const [clientList, setClientList] = useState([]);
    const { selectedClient } = useClients();

    useEffect(() => {
        const fetchClientLists = async () => {
            try {
                const res = await fetch('/api/clients'); // replace with real API
                const data = await res.json();
                setClientList(data);
            } catch (err) {
                console.error('Failed to fetch ClientLists', err);
            }
        };
        fetchClientLists().then();
    }, [selectedClient]);

    return (
      <ClientListContext.Provider value={{ clientList, setClientList }}>
          {children}
      </ClientListContext.Provider>
    );
};

export const useClientList = () => useContext(ClientListContext);
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigator } from './NavigatorsContext';

export const ClientListContext = createContext();

export const ClientListProvider = ({ children }) => {
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedNavigator } = useNavigator();

  // Function to fetch clients, optionally filtered by navigator
  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build the URL with a query parameter if navigatorName is provided
      let url = "/api/clients";
      if (selectedNavigator && selectedNavigator?.name !== 'All') {
        url += `?navigator=${encodeURIComponent(selectedNavigator?.name)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch clients: ${res.status}`);
      }

      const data = await res.json();
      setClientList(data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients on an initial load and when selectedNavigator changes
  useEffect(() => {
    // Get the navigator name to filter by, if any
    const navigatorName = selectedNavigator?.name;

    // Fetch clients, filtered by navigator if needed
    fetchClients(navigatorName).then();

    // If the selectedNavigator changes, we want to refetch clients
  }, [selectedNavigator]);

  // Provide clientList, loading state, error state, and refetch function
  const value = {
    clientList,
    setClientList,
    loading,
    error,
    refetchClients: fetchClients,
  };

  return (
    <ClientListContext.Provider value={value}>
      {children}
    </ClientListContext.Provider>
  );
};

export const useClientList = () => useContext(ClientListContext);
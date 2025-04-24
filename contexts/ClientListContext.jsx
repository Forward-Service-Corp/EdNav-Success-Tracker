import React, { createContext, useContext, useEffect, useState } from "react";
import { useClients } from "./ClientsContext";
import { useNavigators } from "./NavigatorsContext";

export const ClientListContext = createContext();

export const ClientListProvider = ({ children }) => {
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedClient } = useClients();
  const { selectedNavigator } = useNavigators();

  // Function to fetch clients, optionally filtered by navigator
  const fetchClients = async (navigatorName) => {
    setLoading(true);
    setError(null);

    try {
      // Build the URL with query parameter if navigatorName is provided
      let url = "/api/clients";
      if (navigatorName && navigatorName !== "All") {
        url += `?navigator=${encodeURIComponent(navigatorName)}`;
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

  // Fetch clients on initial load and when selectedNavigator changes
  useEffect(() => {
    // Get the navigator name to filter by, if any
    const navigatorName = selectedNavigator?.name;

    // Fetch clients, filtered by navigator if needed
    fetchClients(navigatorName);

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
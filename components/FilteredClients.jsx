import React, { useEffect, useState } from "react";
import { Input } from "/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "/components/ui/select";
import NavigatorSelector from "/components/NavigatorSelector";
import ClientTable from "./ClientTable";
import { useFepsLeft } from "../contexts/FepsLeftContext";

const FilteredClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [clients, setClients] = useState([]);
  const [selectedNavigator, setSelectedNavigator] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedFepLeft } = useFepsLeft();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const url = selectedNavigator
          ? `/api/clients?navigator=${selectedNavigator}`
          : "/api/clients";
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          // Check if the response is an array
          setClients(data); // Directly set the array of clients
        } else if (data && Array.isArray(data.clients)) {
          // Check if it's an object with clients array
          setClients(data.clients);
        } else {
          console.error("Unexpected response structure:", data);
          setClients([]); // Fallback to an empty array if the structure is unexpected
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]); // Fallback to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchClients().then();
  }, [selectedNavigator]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedFepLeft.status === "All" ||
      client.status === selectedFepLeft.status;
    const matchesGroup =
      selectedFepLeft.age === "All" || client.group === selectedFepLeft.age;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  return (
    <div className="space-y-4 p-4">
      <NavigatorSelector
        value={selectedNavigator}
        onChange={setSelectedNavigator}
      />

      <div className="flex space-x-4">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>Status</SelectTrigger>
          <SelectContent>
            {["All", "Active", "In Progress", "Graduated", "Inactive"].map(
              (status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger>Group</SelectTrigger>
          <SelectContent>
            {["All", "Adult", "Youth"].map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div>Loading clients...</div>
      ) : (
        <ClientTable
          clients={filteredClients}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
        />
      )}
    </div>
  );
};

export default FilteredClients;

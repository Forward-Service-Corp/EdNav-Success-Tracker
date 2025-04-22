"use client";
import { useEffect, useMemo, useState } from "react";
import { useClientList } from "../contexts/ClientListContext";
import { useClients } from "../contexts/ClientsContext";
import { useEditing } from "../contexts/EditingContext";
import { useNavigators } from "../contexts/NavigatorsContext";
import { getBadgeColor } from "../lib/ColorMap";
import Badges from "./Badges";
import { useFepsLeft } from "/contexts/FepsLeftContext";

export default function ClientTableNew({
  menuOpen,
  setMenuOpen,
  toggleSidebar,
}) {
  const { clientList } = useClientList();
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft } = useFepsLeft();
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState([]);
  const { setEditing } = useEditing();
  const { selectedClient, setSelectedClient } = useClients({});

  const handleCollapseChange = (status) => {
    setStatusCollapse((prevState) => {
      if (prevState.includes(status)) {
        return prevState.filter((item) => item !== status);
      }
      return [...prevState, status];
    });
  };

  const filteredClients = clientList
    ?.filter((client) => {
      if (selectedNavigator?.name !== "All") {
        return client?.navigator === selectedNavigator?.name;
      }
      return client;
    })
    .filter((client) => {
      const matchesSearch =
        client?.first_name
          ?.toLowerCase()
          .includes(selectedFepLeft.searchTerm.toLowerCase()) ||
        client?.last_name
          ?.toLowerCase()
          .includes(selectedFepLeft.searchTerm.toLowerCase());
      const matchesStatus =
        selectedFepLeft.status === "All" ||
        client?.clientStatus === selectedFepLeft.status;
      const matchesGroup =
        selectedFepLeft.age === "All" || client?.group === selectedFepLeft.age;
      return matchesSearch && matchesStatus && matchesGroup;
    });

  const groupByClientStatus = (clients) => {
    return clients
      .filter((client) => {
        if (selectedNavigator.name !== "All")
          return client?.navigator === selectedNavigator?.name;
        return client;
      })
      .sort((a, b) => (a.clientStatus > b.clientStatus ? 1 : -1))
      .reduce((groups, client) => {
        const status = client.clientStatus || "Unknown";
        if (!groups[status]) groups[status] = [];
        groups[status].push(client);
        return groups;
      }, {});
  };

  const pinnedIds = selectedNavigator?.pinned || [];

  const clientsToShow = useMemo(() => {
    if (!filteredClients) return [];

    if (viewMode === "pinned") {
      return [...filteredClients].sort((a, b) => {
        const aPinned = pinnedIds.includes(a._id.toString());
        const bPinned = pinnedIds.includes(b._id.toString());
        return aPinned === bPinned ? 0 : aPinned ? -1 : 1;
      });
    }

    if (viewMode === "grouped") {
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
    <div className={`relative z-0 h-full w-full`}>
      <div
        className={`no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll`}
      >
        {/*<div className={`px-3 py-4 flex items-center justify-between sticky top-0 left-0 right-0 h-[80px] bg-base-200 shadow z-50`}>*/}
        {/*  <SearchField*/}
        {/*    menuOpen={menuOpen}*/}
        {/*    setMenuOpen={setMenuOpen}*/}
        {/*    setFilterOpen={setFilterOpen}*/}
        {/*    toggleSidebar={toggleSidebar}*/}
        {/*    filterOpen={filterOpen}*/}
        {/*    setViewMode={setViewMode}*/}
        {/*    setStatusCollapse={setStatusCollapse}*/}
        {/*  />*/}
        {/*</div>*/}

        <div className="no-scrollbar overflow-y-scroll">
          <table className="no-scrollbar table overflow-y-scroll">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="block max-h-[600px] overflow-y-auto">
              {clientsToShow.map((person, i) => (
                <tr
                  key={i}
                  className={`transition-colors duration-300 ${selectedClient?._id === person._id ? "bg-base-200" : ""}`}
                  onClick={() => {
                    setEditing("client");
                    setSelectedClient(person);
                    handleCollapseChange("Active");
                  }}
                >
                  <th
                    className={`relative ${
                      selectedClient?._id === person._id
                        ? filterOpen
                          ? "animate-pulse-once sticky top-[47px] z-20"
                          : "animate-pulse-once sticky top-0 z-20"
                        : ""
                    } bg-base-100 transition-all duration-300 ease-in-out`}
                  >
                    {/* Avatar or icon for selected client */}
                    {selectedClient?._id === person._id && (
                      <div className="animate-fadeInZoom absolute top-1 -left-6">
                        <img
                          src="/avatar-flair.png"
                          alt="Selected"
                          className="border-primary h-6 w-6 rounded-full border-2"
                        />
                        {/*<UserCheck className="w-5 h-5 text-primary" />*/}
                      </div>
                    )}
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {person.first_name} {person.last_name}
                        </div>
                        <div className="text-sm opacity-50">
                          {person.latestInteraction}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badges
                      color={
                        selectedClient?._id === person._id
                          ? "inline-flex items-center rounded-md px-2 py-1 text-xs w-24 font-medium bg-white text-center"
                          : getBadgeColor(person.clientStatus.toLowerCase())
                      }
                      label={person.clientStatus}
                    />
                  </td>
                  <td>Purple</td>
                  <th>
                    <button
                      onClick={() => {
                        setEditing("client");
                        setSelectedClient(person);
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      details
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { useClientList } from "../contexts/ClientListContext";
import { useClients } from "../contexts/ClientsContext";
import { useEditing } from "../contexts/EditingContext";
import { useNavigators } from "../contexts/NavigatorsContext";
import { getBadgeColor, getBGColor } from "../lib/ColorMap";
import Badges from "./Badges";
import { useFepsLeft } from "/contexts/FepsLeftContext";
import SearchField from "./SearchField";
import Avvvatars from "avvvatars-react";

export default function ClientTableNew({
  menuOpen,
  setMenuOpen,
  toggleSidebar,
  setOpenPanel, // added
}) {
  const { clientList } = useClientList();
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft } = useFepsLeft();
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [, setStatusCollapse] = useState([]);
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

  const filteredClients = useMemo(() => {
    if (!clientList) return [];

    return clientList
      .filter((client) =>
        selectedNavigator?.name !== "All"
          ? client?.navigator === selectedNavigator?.name
          : true,
      )
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
          selectedFepLeft.age === "All" ||
          client?.group === selectedFepLeft.age;

        return matchesSearch && matchesStatus && matchesGroup;
      });
  }, [clientList, selectedNavigator, selectedFepLeft]);

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
    <div className={`no-scrollbar relative z-0 h-full w-full`}>
      <div
        className={`no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll`}
      >
        <div
          className={`bg-base-200 sticky top-0 right-0 left-0 z-50 flex h-[80px] items-center justify-between px-3 py-4 shadow`}
        >
          <SearchField
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setFilterOpen={setFilterOpen}
            toggleSidebar={toggleSidebar}
            filterOpen={filterOpen}
            setViewMode={setViewMode}
            setStatusCollapse={setStatusCollapse}
          />
        </div>

        <div className="no-scrollbar w-full overflow-y-scroll">
          <table className="no-scrollbar sticky top-80 z-10 table w-full overflow-y-scroll">
            <tbody className="block h-full min-h-[600px] w-full overflow-y-auto">
              {clientsToShow &&
                clientsToShow?.map((person, i) => (
                  <tr
                    key={i}
                    className={`w-full cursor-pointer transition-colors duration-300 ${selectedClient?._id === person._id ? getBGColor(person.clientStatus.toLowerCase()) + getBadgeColor("white") : ""}`}
                    onClick={() => {
                      setEditing("client");
                      setSelectedClient(person);
                      setOpenPanel("profile");
                      handleCollapseChange("Active");
                      if (selectedClient?._id === person._id) {
                        setSelectedClient(null);
                        setOpenPanel(null);
                      } else {
                        setSelectedClient(person);
                      }
                    }}
                  >
                    <td className={``}>
                      <div className="sticky top-80 z-20 flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <Avvvatars
                              value={person.first_name}
                              size={36}
                              displayValue={`${person.first_name.split("")[0]} ${person.last_name.split("")[0]}`}
                              style={{ borderRadius: "50%" }}
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
                    <td>{person.county}</td>
                    <th>
                      <button
                        onClick={() => {
                          setEditing("client");
                          setSelectedClient(person);
                          setOpenPanel("profile");
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

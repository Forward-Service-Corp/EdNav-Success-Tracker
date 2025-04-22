import React from "react";
import { useFepsLeft } from "../contexts/FepsLeftContext";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Sidebar, Wrench, XCircle } from "phosphor-react";

function SearchField({
  menuOpen,
  toggleSidebar,
  filterOpen,
  setFilterOpen,
  setViewMode,
  setStatusCollapse,
}) {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();
  const toggleGrouped = () => {
    setViewMode("grouped");
    setStatusCollapse([]);
  };

  const togglePinned = () => {
    setViewMode("pinned");
    setStatusCollapse([]);
  };

  const toggleAlpha = () => {
    setViewMode("alpha");
    setStatusCollapse([]);
  };

  const toggleDate = () => {
    setViewMode("date");
    setStatusCollapse([]);
  };

  return (
    <div
      className={`top-0 z-50 mb-3 flex h-full items-center justify-between gap-4`}
    >
      <div
        className={`z-50 flex h-full items-center justify-start gap-2 ${menuOpen ? "pr-20 pl-3" : "pl-6"}`}
      >
        <MagnifyingGlass className={`text-base-content/40 -mr-10`} size={20} />
        <input
          name={`client-search`}
          type="text"
          onChange={(e) => {
            setSelectedFepLeft((prev) => {
              return { ...prev, searchTerm: e.target.value };
            });
          }}
          value={selectedFepLeft.searchTerm}
          placeholder="Search by name..."
          className="input bg-info/15 border-base-content/20 rounded-full border-1 pl-9 shadow-none ring-0 outline-none focus:bg-transparent focus:ring-0 focus:outline-0"
        />
        <XCircle
          onClick={() => {
            setSelectedFepLeft((prevState) => {
              return { ...prevState, searchTerm: "" };
            });
          }}
          className={`-ml-10 cursor-pointer ${selectedFepLeft.searchTerm !== "" ? "visible" : "hidden"}`}
          size={26}
          color={`white`}
        />
      </div>
      <div
        className={`search-under-filter cursor-pointer ${filterOpen ? "translate-y-[79px]" : "-translate-y-[84px]"}`}
      >
        <div className="flex items-center justify-end gap-1 filter">
          <input
            onClick={() => setViewMode("")}
            className="btn lg:btn-xs btn-sm btn-successbtn-soft filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="All"
          />
          <input
            onClick={toggleAlpha}
            className="btn lg:btn-xs btn-sm btn-successbtn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="A-Z"
          />
          <input
            onClick={toggleDate}
            className="btn lg:btn-xs btn-sm btn-successbtn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Latest"
          />
          <input
            onClick={toggleGrouped}
            className="btn lg:btn-xs btn-sm btn-successbtn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Grouped"
          />
          <input
            onClick={togglePinned}
            className="btn lg:btn-xs btn-sm btn-successbtn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Pinned"
          />
        </div>
      </div>

      <div className="absolute right-3 z-20 flex cursor-pointer items-center justify-items-center gap-2">
        <Wrench
          size={27}
          className={`${filterOpen ? "text-primary" : "text-base-content/30"}`}
          onClick={() => setFilterOpen(!filterOpen)}
        />
        <Sidebar
          className={`${!menuOpen ? "text-primary" : "text-base-content/30"}`}
          size={27}
          onClick={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default SearchField;
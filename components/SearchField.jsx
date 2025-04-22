import React from "react";
import { useFepsLeft } from "../contexts/FepsLeftContext";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Sidebar, Wrench, XCircle } from "phosphor-react";
import {
  toggleAlpha,
  toggleDate,
  toggleGrouped,
  togglePinned,
} from "../lib/colorMap";

function SearchField({
  menuOpen,
  setMenuOpen,
  filterOpen,
  setFilterOpen,
  setViewMode,
}) {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();

  return (
    <div className={`mb-3 flex h-full items-center justify-between gap-4`}>
      <div className={`z-50 flex h-full items-center justify-start gap-2 pl-5`}>
        <div className={`flex w-full items-center pr-10`}>
          <MagnifyingGlass className={`text-base-content/40`} size={20} />
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
            className="input bg-warning/15 border-base-content/20 absolute right-0 left-5 z-20 cursor-pointer rounded-full border-1 pl-10 shadow-none ring-0 outline-none focus:bg-transparent focus:ring-0 focus:outline-0"
          />
          <XCircle
            onClick={() => {
              setSelectedFepLeft((prevState) => {
                return { ...prevState, searchTerm: "" };
              });
            }}
            className={`absolute left-3/5 z-40 cursor-pointer ${selectedFepLeft.searchTerm !== "" ? "visible" : "hidden"}`}
            size={26}
            color={`white`}
          />
        </div>
      </div>
      <div
        className={`search-under-filter -z-20 cursor-pointer ${filterOpen ? "translate-y-[79px]" : "-translate-y-[84px]"}`}
      >
        <div className="flex items-center justify-end gap-1 filter">
          <input
            onClick={() => setViewMode("")}
            className="btn lg:btn-xs btn-sm btn-success btn-soft filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="All"
          />
          <input
            onClick={toggleAlpha}
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="A-Z"
          />
          <input
            onClick={toggleDate}
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Latest"
          />
          <input
            onClick={toggleGrouped}
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Grouped"
          />
          <input
            onClick={togglePinned}
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Pinned"
          />
        </div>
      </div>

      <div className="absolute right-5 z-20 flex cursor-pointer items-center justify-items-center gap-4">
        <Wrench
          size={25}
          className={`${filterOpen ? "text-success" : "text-base-content/30"}`}
          onClick={() => setFilterOpen(!filterOpen)}
        />
        <Sidebar
          className={`${!selectedFepLeft.menuOpen ? "text-success" : "text-base-content/30"}`}
          size={25}
          onClick={() => {
            setSelectedFepLeft((prevState) => {
              return { ...prevState, menuOpen: !prevState.menuOpen };
            });
            if (menuOpen) {
              setViewMode("");
            }
          }}
        />
      </div>
    </div>
  );
}

export default SearchField;
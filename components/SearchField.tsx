import React from "react";
import { useFepsLeft } from "@/contexts/FepsLeftContext";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Sidebar, Wrench, XCircle } from "phosphor-react";
import { useLayout } from "@/contexts/LayoutContext";

function SearchField({
  menuOpen,
  filterOpen,
  setFilterOpen,
  setViewMode,
  toggleSidebar,
}: {
  menuOpen: boolean;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  setViewMode: (mode: string) => void;
  toggleSidebar: () => void;
}) {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();

  // Check if the LayoutContext is available (if we're in the new layout)
  const [layoutConfig, setLayoutConfig] = React.useState<ReturnType<
    typeof useLayout
  > | null>(null);

  React.useEffect(() => {
    const loadLayout = async () => {
      try {
        const { useLayout } = await import("@/contexts/LayoutContext");
        try {
          setLayoutConfig(useLayout());
        } catch (e) {
          // Layout context is not available, that's okay
          setLayoutConfig(() => null);
        }
      } catch (e) {
        // Module isn't found, that's okay
        setLayoutConfig(null);
      }
    };
    loadLayout().then();
  }, []);

  return (
    <div className={`mb-3 flex h-full items-center justify-between gap-4`}>
      <div className={`z-50 flex h-full items-center justify-start gap-2 pl-5`}>
        <div className={`flex w-full items-center pr-10`}>
          <MagnifyingGlass className={`text-base-content/40`} size={20} />
          <input
            name={`client-search`}
            type="text"
            onChange={(e) => {
              setSelectedFepLeft((prev) => ({
                ...prev,
                searchTerm: e.target.value as "",
              }));
            }}
            value={selectedFepLeft.searchTerm}
            placeholder="Search by name..."
            className="input bg-warning/15 border-base-content/20 absolute right-0 left-5 z-20 cursor-pointer rounded-full border-1 pl-10 shadow-none ring-0 outline-none focus:bg-transparent focus:ring-0 focus:outline-0"
          />
          <XCircle
            onClick={() => {
              setSelectedFepLeft((prevState) => ({
                ...prevState,
                searchTerm: "" as cons,
              }));
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
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="A-Z"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Latest"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Grouped"
          />
          <input
            className="btn lg:btn-xs btn-sm btn-success btn-soft"
            type="radio"
            name="metaframeworks"
            aria-label="Pinned"
          />
        </div>
      </div>

      <div className="absolute right-5 z-20 flex cursor-pointer items-center justify-items-center gap-4">
        {/* Layout Button - Only show if layoutConfig is available */}
        {layoutConfig && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-sm"
            >
              {/* Using SVG directly instead of the LayoutColumns icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="text-base-content/60"
              >
                <rect width="256" height="256" fill="none"></rect>
                <line
                  x1="88"
                  y1="40"
                  x2="88"
                  y2="216"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                ></line>
                <line
                  x1="168"
                  y1="40"
                  x2="168"
                  y2="216"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                ></line>
                <rect
                  x="32"
                  y="40"
                  width="192"
                  height="176"
                  rx="8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                ></rect>
              </svg>
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow">
              <li>
                <a onClick={() => layoutConfig.setLayoutConfig("DEFAULT")}>
                  Default Layout (15/35/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutConfig.setLayoutConfig("NO_SIDEBAR")}>
                  No Sidebar (0/50/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutConfig.setLayoutConfig("TABLE_FOCUS")}>
                  Table Focus (0/70/30)
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* Filter Toggle */}
        <Wrench
          size={25}
          className={`${filterOpen ? "text-success" : "text-base-content/30"}`}
          onClick={() => setFilterOpen(!filterOpen)}
        />

        {/* Sidebar Toggle */}
        <Sidebar
          className={`${!selectedFepLeft.menuOpen ? "text-success" : "text-base-content/30"}`}
          size={25}
          onClick={() => {
            toggleSidebar();
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
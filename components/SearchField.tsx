import React from 'react';
import { useFepsLeft } from '@/contexts/FepsLeftContext';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Sidebar, Wrench, XCircle } from 'phosphor-react';

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

  // Use a safer approach that doesn't involve ReactDOM.render
  const [layoutAvailable, setLayoutAvailable] = React.useState(false);
  const layoutConfigRef = React.useRef({
    setDefault: () => console.log('Layout not available'),
    setNoSidebar: () => console.log('Layout not available'),
    setTableFocus: () => console.log('Layout not available')
  });

  // Check for layout context availability
  React.useEffect(() => {
    const checkLayoutContext = async () => {
      try {
        // Try to import the module
        const LayoutModule = await import('@/contexts/LayoutContext');

        // We won't try to create a test component or use ReactDOM
        //  Instead, we'll just check if we can access the context
        if (typeof window !== 'undefined') {
          try {
            // Try to use the useLayout function in the normal way
            // by creating a stub function and checking if the import worked
            if (LayoutModule && typeof LayoutModule.useLayout === 'function') {
              // Layout module exists, set up mock functions for now
              // The actual useLayout call will happen in a subcomponent
              setLayoutAvailable(true);

              // Create a separate component that renders the controller
              const renderController = () => {
                // Set up a component that will be rendered inside our component
                // and can properly use the hook
                const LayoutController = () => {
                  try {
                    // This is a valid place to use the hook
                    const layoutContext = LayoutModule.useLayout();

                    // Update our ref with the actual functions
                    layoutConfigRef.current = {
                      setDefault: () => layoutContext.setLayoutConfig('DEFAULT'),
                      setNoSidebar: () => layoutContext.setLayoutConfig('NO_SIDEBAR'),
                      setTableFocus: () => layoutContext.setLayoutConfig('TABLE_FOCUS')
                    };

                    // Return null as we don't need to render anything
                    return null;
                  } catch (e) {
                    console.log('Layout hook failed:', e);
                    return null;
                  }
                };

                return <LayoutController />;
              };

              // Return the controller component separately
              return renderController;
            }
          } catch (e) {
            console.log('Layout module exists but hook failed:', e);
          }
        }
      } catch (e) {
        console.log('Layout module not found:', e);
      }

      return null;
    };

    // Execute the async function and handle the controller
    checkLayoutContext().then(controllerRenderer => {
      if (controllerRenderer) {
        // We're just passing the result to use elsewhere, not conditionally rendering
        setLayoutAvailable(true);
      }
    });
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
                searchTerm: e.target.value as ''
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
                searchTerm: ''
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
        {/* Layout Button - Only show if the layout is available */}
        {layoutAvailable && (
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
                <a onClick={() => layoutConfigRef.current.setDefault()}>
                  Default Layout (15/35/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutConfigRef.current.setNoSidebar()}>
                  No Sidebar (0/50/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutConfigRef.current.setTableFocus()}>
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

SearchField.displayName = 'SearchField';

export default SearchField;
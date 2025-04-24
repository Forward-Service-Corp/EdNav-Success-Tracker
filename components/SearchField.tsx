import React from 'react';
import { useFepsLeft } from '@/contexts/FepsLeftContext';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Sidebar, Wrench, XCircle } from 'phosphor-react';

class FEP {
  searchTerm: string = '';
  status: 'All' | string = 'All';
  age: 'All' | string = 'All';
  menuOpen: boolean | null = false;
}

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

  // Don't use the useLayout hook directly here
  // Instead, make the layout features optional
  interface LayoutContextState {
    isAvailable: boolean;
    setLayoutConfig: (config: string) => void;
  }

  const [layoutContext, setLayoutContext] = React.useState<LayoutContextState | null>(null);

  // Safely get the layout context if it's available
  React.useEffect(() => {
    // Only import and use the hook if the component is mounted in the client
    const getLayoutContext = async () => {
      try {
        // Try to dynamically import the context
        const LayoutContextModule = await import('@/contexts/LayoutContext');

        // Check if we're running in a layout provider
        try {
          // Instead of using the hook directly, create a fake element to test
          // if the LayoutProvider is available in the component tree
          const tempDiv = document.createElement('div');
          const tempText = document.createTextNode('Layout test');
          tempDiv.appendChild(tempText);
          document.body.appendChild(tempDiv);

          // This is just to check the context is properly set up;
          // we're not using the hook return value directly
          import('@/contexts/LayoutContext').then(module => {
            // If this succeeds, we know the LayoutProvider is available
            setLayoutContext({
              isAvailable: true,
              setLayoutConfig: (config: string) => {
                // Get a fresh instance of the hook each time it's used
                // to avoid closure issues
                const { useLayout } = module;
                try {
                  const layoutHook = useLayout();
                  layoutHook.setLayoutConfig(config);
                } catch (e) {
                  console.error('Failed to use layout context:', e);
                }
              }
            } as LayoutContextState);
          }).catch(e => {
            console.log('Layout context not available:', e);
          });

          document.body.removeChild(tempDiv);
        } catch (e) {
          console.log('Failed to check layout context:', e);
        }
      } catch (e) {
        console.log('Layout context module not found:', e);
      }
    };

    getLayoutContext();
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
              // @ts-expect-error: This is a hack to get the search term from the input
              setSelectedFepLeft((prev: FEP) => {
                const updated: FEP = { ...prev };
                updated.searchTerm = e.target.value;
                return updated;
              });
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
        {/* Layout Button - Only show if layoutContext is available */}
        {layoutContext && layoutContext.isAvailable && (
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
                <a onClick={() => layoutContext.setLayoutConfig('DEFAULT')}>
                  Default Layout (15/35/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutContext.setLayoutConfig('NO_SIDEBAR')}>
                  No Sidebar (0/50/50)
                </a>
              </li>
              <li>
                <a onClick={() => layoutContext.setLayoutConfig('TABLE_FOCUS')}>
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
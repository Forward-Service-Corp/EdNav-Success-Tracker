import React from 'react';
import { Layout } from 'phosphor-react';

function LayoutChangeButton({
                              setLayoutConfig,
                              activeLayout,
                              setActiveLayout
                            }: {
  setLayoutConfig: (layout: string) => void;
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
}) {

  // Function to handle layout changes
  const handleLayoutChange = (layoutName: string) => {
    // console.log('Setting layout to:', layoutName);

    // Apply layout directly through context
    setLayoutConfig(layoutName);

    // Also update local state
    setActiveLayout(layoutName);

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentLayout', layoutName);
    }
  };

  // Function to get opacity based on active layout
  const getOpacity = (layout: string) => {
    return activeLayout === layout ? 'opacity-100' : 'opacity-50 hover:opacity-70';
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-xl p-0"
      >
        <Layout size={48} weight={`thin`} className={`text-base-content/30 hover:text-base-content`}
                onClick={() => handleLayoutChange('DEFAULT')} aria-label="Change Layout" />

      </div>
      <ul className="dropdown-content menu bg-base-100 rounded-box left-0 z-[999] w-[120px] p-2 shadow">
        <li className="mb-1">
          <button onClick={() => handleLayoutChange('DEFAULT')} className="">
            <div className={`flex items-center justify-between ${activeLayout === 'DEFAULT' ? 'border-2' : ''}`}>
              <div className={`flex h-[22px] w-[164px] rounded overflow-hidden ${getOpacity('DEFAULT')}`}>
                <div className="bg-success h-full w-4"></div>
                <div className="flex flex-col justify-center items-center bg-info h-full w-9 gap-1">
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                </div>
                <div className="bg-warning h-full w-11 flex items-center justify-center rounded-r"></div>
              </div>
            </div>
          </button>
        </li>
        <li className="mb-1">
          <button onClick={() => handleLayoutChange('NO_SIDEBAR')} className="">
            <div className={`flex items-center justify-between ${activeLayout === 'NO_SIDEBAR' ? 'border-2' : ''} `}>
              <div className={`flex h-[22px] w-[84px] rounded overflow-hidden ${getOpacity('NO_SIDEBAR')}`}>
                <div className="flex flex-col justify-center items-center bg-info h-full flex-1 gap-1">
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                </div>
                <div className="bg-warning h-full flex-1 flex items-center justify-center rounded-r"></div>
              </div>
            </div>
          </button>
        </li>
        <li className="mb-1">
          <button onClick={() => handleLayoutChange('TABLE_FOCUS')} className="">
            <div className={`flex items-center justify-between ${activeLayout === 'TABLE_FOCUS' ? 'border-2' : ''}`}>
              <div className={`flex h-[22px] w-[94px] rounded overflow-hidden ${getOpacity('TABLE_FOCUS')}`}>
                <div className="flex flex-col justify-center items-center bg-info h-full w-16 gap-1">
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                </div>
                <div className="bg-warning h-full w-8 flex items-center justify-center rounded-r"></div>
              </div>
            </div>
          </button>
        </li>
        <li className="mb-1">
          <button onClick={() => handleLayoutChange('DETAILS_FOCUS')} className="">
            <div className={`flex items-center justify-between  ${activeLayout === 'DETAILS_FOCUS' ? 'border-2' : ''}`}>
              <div className={`flex h-[22px] w-[85px] rounded overflow-hidden ${getOpacity('DETAILS_FOCUS')}`}>
                <div className="flex flex-col justify-center items-center bg-info h-full w-9 gap-1">
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                </div>
                <div className="bg-warning h-full w-20 flex items-center justify-center rounded-r"></div>
              </div>
            </div>
          </button>
        </li>
        <li>
          <button onClick={() => handleLayoutChange('SIDEBAR_TABLE_ONLY')} className="">
            <div
              className={`flex items-center justify-between ${activeLayout === 'SIDEBAR_TABLE_ONLY' ? 'border-2' : ''} `}>
              <div className={`flex h-[22px] w-[84px] rounded overflow-hidden ${getOpacity('SIDEBAR_TABLE_ONLY')}`}>
                <div className="bg-success h-full w-5"></div>
                <div className="flex flex-col justify-center items-center bg-info h-full w-22 gap-1">
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                  <div className="border-t border-dashed border-info-content/30 w-[74%]"></div>
                </div>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default LayoutChangeButton;
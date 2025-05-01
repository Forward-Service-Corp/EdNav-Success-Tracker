import React from 'react';
import Logo from './Logo';
import FilterSelectRadiosAge from './FilterSelectRadiosAge';
import FilterSelectRadios from './FilterSelectRadios';
import ThemeSwitcher from './ThemeSwitcher';
import NavigatorSelector from './NavigatorSelector';
import Button from './Button';
import { useLayout } from '../contexts/LayoutContext';
import { ClientViewToggles } from './ClientViewToggles';

function Sidebar({

                   setOpenPanel

                 }) {
  const {
    currentLayout,
    // setLayoutConfig,
    isSidebarVisible,
    isDetailsVisible
    // toggleSidebar
  } = useLayout();
// Direct panel styling based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: isSidebarVisible ? '230px' : '0', // Fixed 230 px width
        maxWidth: isSidebarVisible ? '230px' : '0',
        display: isSidebarVisible ? 'block' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
      table: {
        width: `${currentLayout.table}%`,
        maxWidth: `${currentLayout.table}%`,
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
      details: {
        width: `${currentLayout.details}%`,
        maxWidth: `${currentLayout.details}%`,
        display: isDetailsVisible ? 'block' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    };
  };
  const styles = getPanelStyles();
  return (
    <div
      className="bg-base-100 rounded flex-none flex flex-col p-5 pt-2 items-center justify-start gap-5 h-full relative"
      style={styles.sidebar}
    >
      <Logo />
      <div
        className={`text-base-content box-border flex w-full flex-col gap-4 mt-5 `}
      >
        <Button use={`primary`} label={`Dashboard`} onClick={() => setOpenPanel('')} />
        <div className="divider mt-8 mb-3">Age Filters</div>
        <FilterSelectRadiosAge />
      </div>
      <div
        className={`text-base-content/40 box-border flex w-full flex-col gap-4 `}
      >
        <div className="divider mt-8">Status Filters</div>
        <FilterSelectRadios />
      </div>
      <ClientViewToggles />
      <div
        className=" flex flex-col mt-8 items-center border-t border-base-content/10 gap-6 py-6">
        <ThemeSwitcher />
        <NavigatorSelector />
        <Button use="primary" label="+ Add Client" onClick={() => setOpenPanel('form')}
                customStyle={`w-[180px]`} />
        <Button use="secondary" label="Logout" onClick={() => setOpenPanel('form')} customStyle={`w-[180px]`} />
      </div>
    </div>
  );
}

export default Sidebar;
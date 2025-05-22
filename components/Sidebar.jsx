import React from "react";
import Logo from "./Logo";
import FilterSelectRadiosAge from "./FilterSelectRadiosAge";
import FilterSelectRadios from "./FilterSelectRadios";
import ThemeSwitcher from "./ThemeSwitcher";
import NavigatorSelector from "./NavigatorSelector";
import Button from "./Button";
import { useLayout } from "../contexts/LayoutContext";
import { signOut } from "next-auth/react";

function Sidebar({ setOpen, open }) {
  const { currentLayout, isSidebarVisible, isDetailsVisible } = useLayout();
  // Direct panel styling based on the current layout
  const getPanelStyles = () => {
    return {
      sidebar: {
        width: isSidebarVisible ? "230px" : "0", // Fixed 230 px width
        maxWidth: isSidebarVisible ? "230px" : "0",
        display: isSidebarVisible ? "block" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      table: {
        width: `${currentLayout.table}%`,
        maxWidth: `${currentLayout.table}%`,
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      details: {
        width: `${currentLayout.details}%`,
        maxWidth: `${currentLayout.details}%`,
        display: isDetailsVisible ? "block" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
    };
  };
  const styles = getPanelStyles();
  return (
    <div
      className="bg-base-100 relative flex h-full flex-none flex-col items-center justify-start gap-5 rounded p-5 pt-2"
      style={styles.sidebar}
    >
      <Logo />
      <div
        className={`text-base-content mt-10 box-border flex w-full flex-col gap-4`}
      >
        <Button
          use={`primary`}
          label={`Dashboard`}
          onClick={() => setOpen("")}
        />
        <Button
          use={`primary`}
          label="+ Add Client"
          onClick={() => setOpen("form")}
        />
        <Button use={`accent`} label="Logout" onClick={signOut} />
        <div className="divider mt-8 mb-3">Age Filters</div>
        <FilterSelectRadiosAge />
      </div>
      <div
        className={`text-base-content/40 box-border flex w-full flex-col gap-4`}
      >
        <div className="divider mt-8">Status Filters</div>
        <FilterSelectRadios />
      </div>
      <div className="border-base-content/10 mt-8 flex flex-col items-center gap-6 border-t py-6">
        <ThemeSwitcher />
        <NavigatorSelector />
      </div>
    </div>
  );
}

export default Sidebar;
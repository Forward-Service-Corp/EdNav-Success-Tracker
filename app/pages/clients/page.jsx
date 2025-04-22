"use client";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import Sidebar from "../../../components/Sidebar";
import ClientProfile from "../../../components/ClientProfile";
import ClientTableNew from "../../../components/ClientTableNew";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AddClientForm from "../../../components/AddClientForm";

// import { useNotification } from '../../../contexts/NotificationContext';

function ClientsPage() {
  // const { notify, setNotify } = useNotification(false);
  const [sidebarSize, setSidebarSize] = useState({
    left: 10,
    middle: 45,
    right: 4,
  }); // size in percentage
  const { loading, setLoading } = useLoading(false);
  useEffect(() => {
    console.log("loading");
    setLoading(false);
  }, []);
  const toggleSidebar = () => {
    setSidebarSize((prev) => ({
      ...prev,
      left: prev?.left === 15 ? 25 : 15,
      middle: prev?.middle === 25 ? 40 : 25,
      right: prev?.right === 60 ? 45 : 6,
    }));
  };
  return (
    <div className={`no-scrollbar box-border h-screen w-screen`}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          id="sidebar"
          size={sidebarSize.left}
          minSize={15}
          onResize={(newSize) =>
            setSidebarSize((prev) => ({ ...prev, left: newSize }))
          }
          className="max-w-[20%] min-w-[15%] transition-all duration-200"
        >
          <Sidebar
            toggleSidebar={toggleSidebar}
            loading={loading}
            setLoading={setLoading}
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle={true}
          direction="horizontal"
          className="border-base-content/20 h-full border-r"
        />

        <ResizablePanel
          size={sidebarSize.middle}
          onResize={(newSize) =>
            setSidebarSize((prev) => ({ ...prev, middle: newSize }))
          }
          className="grow transition-all duration-200"
        >
          <ClientTableNew toggleSidebar={toggleSidebar} />
        </ResizablePanel>
        <ResizableHandle
          withHandle={true}
          direction="horizontal"
          className="border-base-content/20 h-full border-r"
        />
        <ResizablePanel
          size={sidebarSize.right}
          onResize={(newSize) =>
            setSidebarSize((prev) => ({ ...prev, right: newSize }))
          }
          className="transition-all duration-200"
        >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <ClientProfile />
            </ResizablePanel>
            <ResizableHandle
              withHandle={true}
              direction="horizontal"
              className="border-base-content/20 w-full border-b"
            />
            <ResizablePanel>
              <AddClientForm />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default ClientsPage;

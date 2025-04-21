// components/admin/AdminToolsPage.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UserManagement from "./UserManagement";
import SystemSettings from "./SystemSettings";
import ActivityLogs from "./ActivityLogs";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function AdminToolsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Admin Tools</h1>
          <p className="text-muted-foreground">
            Manage system settings, users, and view logs
          </p>
        </div>
        <div className="bg-warning/20 border-warning/30 text-warning-foreground rounded-md border px-4 py-2 text-sm">
          Logged in as{" "}
          <span className="font-semibold">{session?.user?.name}</span>
        </div>
      </div>

      <Tabs
        defaultValue="users"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div role="tablist" className="tabs tabs-lift tabs-box">
          <a
            onClick={() => {
              setActiveTab("users");
            }}
            role="tab"
            className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
          >
            User Management
          </a>
          <a
            role="tab"
            onClick={() => {
              setActiveTab("settings");
            }}
            className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
          >
            Settings
          </a>
          <a
            role="tab"
            onClick={() => {
              setActiveTab("logs");
            }}
            className={`tab ${activeTab === "logs" ? "tab-active" : ""}`}
          >
            Activity Logs
          </a>
        </div>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ActivityLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
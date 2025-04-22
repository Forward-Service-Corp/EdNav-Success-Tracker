"use client";
import React, { useEffect, useState } from "react";
import CombinedFeed from "../components/CombinedFeed";
import ClientProfileHeader from "../components/ClientProfileHeader";
import ClientProfileProgress from "../components/ClientProfileProgress";
import ClientProfilePersonalOrganization from "../components/ClientProfilePersonalOrganization";
import ClientProfileTABEOrientation from "../components/ClientProfileTABEOrientation";
import { useClients } from "../contexts/ClientsContext";

export default function ClientProfile({ setOpenPanel }) {
  const [isMounted, setIsMounted] = useState(false);
  const [, setSelectedNavigator] = useState("");
  const { selectedClient, setSelectedClient } = useClients();
  const [actions, setActions] = useState([]); // actions are the activities
  const [hasTrackable, setHasTrackable] = useState([]);
  const [hasTrackableUpdated, setHasTrackableUpdated] = useState(false);
  const [hasTrackableCopy, setHasTrackableCopy] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setIsMounted(true); // ✅ Mark component as mounted before interacting with localStorage
    if (typeof window !== "undefined") {
      const storedNavigator = localStorage.getItem("navigatorName") || "";
      setSelectedNavigator(storedNavigator);
    }
  }, []);

  let getActions;
  getActions = async () => {
    if (!selectedClient) return;
    try {
      await fetch(`/api/activities?clientId=${selectedClient._id}`)
        .then((response) => response.json())
        .then((data) => {
          setActions(data);
        })
        .catch((error) =>
          console.error("Error fetching client activities:", error),
        );
    } catch (error) {
      console.error("Error fetching client activities:", error);
    }
  };

  useEffect(() => {
    getActions().then();
  }, [selectedClient, setActions]);

  useEffect(() => {
    if (selectedClient && selectedClient.trackable) {
      setHasTrackable(selectedClient.trackable.items);
      if (!hasTrackableUpdated) {
        const copy = JSON.parse(JSON.stringify(selectedClient.trackable.items));
        setHasTrackableCopy(copy);
        setHasTrackableUpdated(true);
      }
    } else {
      setHasTrackable([]);
    }
  }, [actions, selectedClient]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;

  return (
    <div className={`relative h-full w-full flex-[4]`}>
      <div
        className={`no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll`}
      >
        <ClientProfileHeader setOpenPanel={setOpenPanel} />
        <div className={`mt-[30px] grid grid-cols-1 gap-4 md:grid-cols-2`}>
          <div className={`col-span-2`}>
            <ClientProfilePersonalOrganization />
          </div>
          <div className={`col-span-2`}>
            <ClientProfileProgress
              hasTrackableCopy={hasTrackableCopy}
              hasTrackable={hasTrackable}
              setHasTrackable={setHasTrackable}
              updated={updated}
              setUpdated={setUpdated}
            />
          </div>
          <div className={`col-span-1`}>
            <CombinedFeed />
          </div>
          <div className={`col-span-1`}>
            <ClientProfileTABEOrientation />
          </div>
        </div>
      </div>
    </div>
  );
}

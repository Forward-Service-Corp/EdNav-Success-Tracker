'use client';
import React, { useEffect, useState } from 'react';
import ClientProfileDetails from './ClientProfileDetails';
import CombinedFeed from '@/components/CombinedFeed';
import ClientProfileHeader from '@/components/ClientProfileHeader';
import { useEditing } from '@/contexts/EditingContext';
import ClientProfileProgress from '@/components/ClientProfileProgress';
import ClientProfilePersonalOrganization from '@/components/ClientProfilePersonalOrganization';
import ClientProfileTABEOrientation from '@/components/ClientProfileTABEOrientation';
import { useClients } from '@/contexts/ClientsContext';

export default function ClientProfile({ menuOpen, setMenuOpen }) {
    const [isMounted, setIsMounted] = useState(false);
    const [, setSelectedNavigator] = useState("");
    const { setEditing } = useEditing();
    const { selectedClient } = useClients();
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
              .then(response => response.json())
              .then(data => {
                  setActions(data);
              })
              .catch(error => console.error('Error fetching client activities:', error));
        } catch (error) {
            console.error('Error fetching client activities:', error);
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

    const [tabState] = useState("Profile");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ✅ Prevent hydration mismatch by rendering only after mount
    if (!isMounted) return null;

    return (
      <div className={`flex flex-col w-full h-full overflow-y-scroll no-scrollbar relative`}>
          <ClientProfileHeader />
          <div className={`mt-[40px]`}>
              <ClientProfileProgress hasTrackableCopy={hasTrackableCopy} hasTrackable={hasTrackable}
                                     setHasTrackable={setHasTrackable} updated={updated} setUpdated={setUpdated} />
              <CombinedFeed />
              <ClientProfilePersonalOrganization />
              <ClientProfileTABEOrientation />
              <ClientProfileDetails setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
          </div>
      </div>
    )
}


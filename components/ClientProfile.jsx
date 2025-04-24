"use client";
import React, { useEffect, useState } from 'react';
import CombinedFeed from './CombinedFeed';
import ClientProfileHeader from '../components/ClientProfileHeader';
import ClientProfileProgress from '../components/ClientProfileProgress';
import ClientProfilePersonalOrganization from '../components/ClientProfilePersonalOrganization';
import ClientProfileTABEOrientation from '../components/ClientProfileTABEOrientation';
import { useClients } from '@/contexts/ClientsContext';
import ActivityModal from '../components/ActivityModal';

export default function ClientProfile({ setOpenPanel }) {
  const [isMounted, setIsMounted] = useState(false);
  const [, setSelectedNavigator] = useState("");
  const { selectedClient, setSelectedClient } = useClients();
  const [actions, setActions] = useState([]); // actions are the activities
  const [hasTrackable, setHasTrackable] = useState([]);
  const [hasTrackableUpdated, setHasTrackableUpdated] = useState(false);
  const [hasTrackableCopy, setHasTrackableCopy] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState("");

  useEffect(() => {
    setIsMounted(true); // ✅ Mark component as mounted before interacting with localStorage
    if (typeof window !== "undefined") {
      const storedNavigator = localStorage.getItem("navigatorName") || "";
      setSelectedNavigator(storedNavigator);

      // Only set up modal function if it doesn't already exist
      if (!window.openActivityModal) {
        console.log('Setting up openActivityModal from ClientProfile');
        window.openActivityModal = () => {
          console.log('Opening activity modal from ClientProfile');
          setActivityModalOpen('activity');
        };
      }

      // Listen for trackable updates
      const handleTrackableUpdate = (event) => {
        console.log('Received trackableUpdated event in ClientProfile:', event.detail);

        // Get the current selected client from data attribute
        const currentClientId = document.getElementById('client-profile-root')?.dataset?.clientId;

        if (event.detail && event.detail.trackable &&
          event.detail.clientId &&
          (currentClientId === event.detail.clientId ||
            (selectedClient && selectedClient._id === event.detail.clientId))) {
          console.log('Applying trackable update to current client');

          // Schedule update for next render cycle
          setTimeout(() => {
            try {
              // Get the latest selected client inside the timeout
              const latestSelectedClient = document.getElementById('client-profile-root')?.dataset?.clientId
                ? { _id: document.getElementById('client-profile-root')?.dataset?.clientId }
                : selectedClient;

              if (!latestSelectedClient) {
                console.warn('No client available to update trackable data');
                return;
              }

              // Update client with new trackable data
              const updatedClient = {
                ...latestSelectedClient,
                trackable: event.detail.trackable
              };

              console.log('Updating client with trackable data:', updatedClient);
              setSelectedClient(updatedClient);

              // Update local trackable state
              setHasTrackable(event.detail.trackable.items || []);
              setHasTrackableCopy(JSON.parse(JSON.stringify(event.detail.trackable.items || [])));
              setHasTrackableUpdated(true);
            } catch (error) {
              console.error('Error updating client with trackable data:', error);
            }
          }, 0);
        }
      };

      // Add event listener
      window.addEventListener('trackableUpdated', handleTrackableUpdate);

      // Clean up
      return () => {
        window.removeEventListener('trackableUpdated', handleTrackableUpdate);
      };
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
    if (selectedClient && selectedClient._id) {
      console.log('ClientProfile: Client selected, checking for trackable data');

      // Safety check for trackable data
      if (selectedClient.trackable && Array.isArray(selectedClient.trackable.items)) {
        console.log('ClientProfile: Setting hasTrackable from client', selectedClient.trackable);
        setHasTrackable(selectedClient.trackable.items);

        // Only create copy if it hasn't been updated yet
        if (!hasTrackableUpdated) {
          const copy = JSON.parse(JSON.stringify(selectedClient.trackable.items));
          setHasTrackableCopy(copy);
          setHasTrackableUpdated(true);
        }

        // Check localStorage for cached trackable state
        if (typeof window !== 'undefined') {
          try {
            const cachedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
            if (cachedTrackable) {
              const parsed = JSON.parse(cachedTrackable);
              console.log('Found cached trackable data:', parsed);

              // Only use cached data if it has items array
              if (parsed && Array.isArray(parsed.items)) {
                const cachedCompleted = parsed.items.filter(item => item && item.completed).length;
                const currentCompleted = selectedClient.trackable.items
                  .filter(item => item && item.completed).length;

                if (cachedCompleted > currentCompleted) {
                  console.log('Using cached trackable data with more completed items');
                  setHasTrackable(parsed.items);
                  setHasTrackableCopy(JSON.parse(JSON.stringify(parsed.items)));
                  setHasTrackableUpdated(true);

                  // Update client object with cached data for consistency
                  setTimeout(() => {
                    const updatedClient = {
                      ...selectedClient,
                      trackable: {
                        ...selectedClient.trackable,
                        items: parsed.items
                      }
                    };
                    setSelectedClient(updatedClient);
                  }, 0);
                }
              }
            }
          } catch (e) {
            console.error('Error reading cached trackable', e);
          }
        }
      } else if (selectedClient.trackable && !Array.isArray(selectedClient.trackable.items)) {
        // Handle invalid trackable data by initializing empty arrays
        console.warn('Client has trackable but no valid items array');
        setHasTrackable([]);
        setHasTrackableCopy([]);
        setHasTrackableUpdated(false);
      } else {
        // No trackable data at all
        console.log('Client has no trackable data');
        setHasTrackable([]);
        setHasTrackableCopy([]);
        setHasTrackableUpdated(false);
      }
    } else {
      // No client selected
      setHasTrackable([]);
      setHasTrackableCopy([]);
      setHasTrackableUpdated(false);
    }
  }, [selectedClient, hasTrackableUpdated]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle activity addition success
  const handleActivitySuccess = (result) => {
    console.log('Activity successfully added in ClientProfile:', result);
    
    // Refresh activities
    getActions().then();

    // Check if this is a trackable activity (GED/HSED)
    if (result && result.trackable) {
      console.log('Trackable activity detected:', result.trackable);

      // If we have a selected client, update its trackable data
      if (selectedClient) {
        // Schedule update for next render cycle
        setTimeout(() => {
          const updatedClient = {
            ...selectedClient,
            trackable: result.trackable
          };
          setSelectedClient(updatedClient);

          // Also update local state
          setHasTrackable(result.trackable.items || []);
          setHasTrackableCopy(JSON.parse(JSON.stringify(result.trackable.items || [])));
          setHasTrackableUpdated(true);
        }, 0);
      }
    }
  };

  // ✅ Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;

  return (
    <div
      className={`relative h-full w-full flex-[4]`}
      id="client-profile-root"
      data-client-id={selectedClient?._id || ''}
    >
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

      {/* Activity Modal */}
      <ActivityModal
        open={activityModalOpen}
        setOpen={setActivityModalOpen}
        onSuccess={handleActivitySuccess}
      />

      {/* Simplified Activity Manager */}
      {/*<SimplifiedActivityManager />*/}
    </div>
  );
}
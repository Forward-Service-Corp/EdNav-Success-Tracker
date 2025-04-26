"use client";
import React, { useEffect, useRef, useState } from 'react';
import CombinedFeed from './CombinedFeed';
import ClientProfileHeader from '../components/ClientProfileHeader';
import ClientProfileProgress from '../components/ClientProfileProgress';
import ClientProfilePersonalOrganization from '../components/ClientProfilePersonalOrganization';
import ClientProfileTABEOrientation from '../components/ClientProfileTABEOrientation';
import { useClient } from '/contexts/ClientContext';
import ActivityModal from '../components/ActivityModal';
import { useLayout } from '/contexts/LayoutContext';

export default function ClientProfile({ setOpenPanel }) {
  const [isMounted, setIsMounted] = useState(false);
  const [, setSelectedNavigator] = useState("");
  const { selectedClient, setSelectedClient } = useClient();
  const [, setActions] = useState([]); // actions are the activities
  const [hasTrackable, setHasTrackable] = useState([]);
  const [hasTrackableUpdated, setHasTrackableUpdated] = useState(false);
  const [hasTrackableCopy, setHasTrackableCopy] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState("");
  const [slideState, setSlideState] = useState('out'); // "in" or "out"
  const { currentLayout } = useLayout();
  const profileRef = useRef(null);

  // State for tracking container width and layout config
  const [, setContainerWidth] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState({
    isNarrow: false,
    isMedium: false,
    isWide: true
  });

  // Watch for changes to the selectedClient and animate accordingly
  useEffect(() => {
    if (selectedClient) {
      // If a client is selected, slide in
      setSlideState('in');
    } else {
      // If no client is selected, slide out
      setSlideState('out');
    }
  }, [selectedClient]);

  // Update container width on layout changes
  useEffect(() => {
    if (profileRef.current) {
      updateContainerWidth();
    }
  }, [currentLayout, isMounted]);

  // Set up a resize observer to track container width changes
  useEffect(() => {
    if (!profileRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateContainerWidth();
      }
    });

    resizeObserver.observe(profileRef.current);

    return () => {
      if (profileRef.current) {
        resizeObserver.unobserve(profileRef.current);
      }
    };
  }, [isMounted]);

  // Update container width and determine layout configuration
  const updateContainerWidth = () => {
    if (!profileRef.current) return;

    const width = profileRef.current.offsetWidth;
    setContainerWidth(width);

    // Determine layout configuration based on container width
    if (width < 500) {
      setLayoutConfig({
        isNarrow: true,
        isMedium: false,
        isWide: false
      });
    } else if (width < 800) {
      setLayoutConfig({
        isNarrow: false,
        isMedium: true,
        isWide: false
      });
    } else {
      setLayoutConfig({
        isNarrow: false,
        isMedium: false,
        isWide: true
      });
    }
  };

  useEffect(() => {
    setIsMounted(true); // ✅ Mark component as mounted before interacting with localStorage
    if (typeof window !== "undefined") {
      const storedNavigator = localStorage.getItem("navigatorName") || "";
      setSelectedNavigator(storedNavigator);

      // Only set up a modal function if it doesn't already exist
      if (!window.openActivityModal) {
        // console.log('Setting up openActivityModal from ClientProfile');
        window.openActivityModal = () => {
          // Only allow opening the activity modal if a client is selected
          if (selectedClient) {
            // console.log('Opening activity modal from ClientProfile');
            setActivityModalOpen('activity');
          } else {
            console.warn('Cannot open activity modal: No client selected');
            if (typeof window.showNotification === 'function') {
              window.showNotification({
                title: 'No Client Selected',
                message: 'Please select a client before adding an activity.',
                type: 'warning',
                duration: 3000
              });
            } else if (window.alert) {
              window.alert('Please select a client before adding an activity.');
            }
          }
        };
      }

      // Listen for trackable updates
      const handleTrackableUpdate = (event) => {
        // console.log('Received trackableUpdated event in ClientProfile:', event.detail);

        // Get the current selected client from the data attribute
        const currentClientId = document.getElementById('client-profile-root')?.dataset?.clientId;

        if (event.detail && event.detail.trackable &&
          event.detail.clientId &&
          (currentClientId === event.detail.clientId ||
            (selectedClient && selectedClient._id === event.detail.clientId))) {
          // console.log('Applying trackable update to the current client');

          // Schedule update for the next render cycle
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

              // console.log('Updating client with trackable data:', updatedClient);
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
      // console.log('ClientProfile: Client selected, checking for trackable data');

      // Safety check for trackable data
      if (selectedClient.trackable && Array.isArray(selectedClient.trackable.items)) {
        // console.log('ClientProfile: Setting hasTrackable from a client', selectedClient.trackable);
        setHasTrackable(selectedClient.trackable.items);

        // Only create a copy if it hasn't been updated yet
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
              // console.log('Found cached trackable data:', parsed);

              // Only use cached data if it has an item array
              if (parsed && Array.isArray(parsed.items)) {
                const cachedCompleted = parsed.items.filter(item => item && item.completed).length;
                const currentCompleted = selectedClient.trackable.items
                  .filter(item => item && item.completed).length;

                if (cachedCompleted > currentCompleted) {
                  // console.log('Using cached trackable data with more completed items');
                  setHasTrackable(parsed.items);
                  setHasTrackableCopy(JSON.parse(JSON.stringify(parsed.items)));
                  setHasTrackableUpdated(true);

                  // Update a client object with cached data for consistency
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
        // console.log('Client has no trackable data');
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
    // console.log('Activity successfully added in ClientProfile:', result);
    
    // Refresh activities
    getActions().then();

    // Check if this is a trackable activity (GED/HSED)
    if (result && result.trackable) {
      // console.log('Trackable activity detected:', result.trackable);

      // If we have a selected client, update its trackable data
      if (selectedClient) {
        // Schedule update for the next render cycle
        setTimeout(() => {
          // Make sure we preserve the createdAt timestamp and savedInDatabase flags
          const trackableWithTimestamp = {
            ...result.trackable,
            createdAt: result.trackable.createdAt || new Date().toISOString(),
            // Keep the items array with savedInDatabase flags intact
            items: (result.trackable.items || []).map(item => ({
              ...item,
              // Preserve savedInDatabase flag if it exists, otherwise default to false
              savedInDatabase: item.savedInDatabase === true
            }))
          };
          
          const updatedClient = {
            ...selectedClient,
            trackable: trackableWithTimestamp
          };
          setSelectedClient(updatedClient);

          // Update local state but preserve savedInDatabase flags
          setHasTrackable(trackableWithTimestamp.items);

          // For hasTrackableCopy, only mark items as completed if they're saved in a database
          const itemsForCopy = trackableWithTimestamp.items.map(item => ({
            ...item,
            completed: item.savedInDatabase === true ? item.completed : false
          }));

          setHasTrackableCopy(itemsForCopy);
          setHasTrackableUpdated(true);

          // Also save to localStorage for persistence
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`trackable-${selectedClient._id}`,
                JSON.stringify(trackableWithTimestamp)
              );
            } catch (e) {
              console.error('Failed to save trackable to localStorage', e);
            }
          }
        }, 0);
      }
    }
  };

  // Handle closing the activity modal when there's no selected client
  const handleActivityModalOpen = (state) => {
    // console.log('Activity modal open state changing from', activityModalOpen, 'to', state);

    if (!selectedClient && state) {
      console.warn('Cannot open activity modal: No client selected');
      if (typeof window !== 'undefined' && typeof window.showNotification === 'function') {
        window.showNotification({
          title: 'No Client Selected',
          message: 'Please select a client before adding an activity.',
          type: 'warning',
          duration: 3000
        });
      }
      return;
    }

    // If we're closing the modal, make sure we preserve the selected client
    if (state === '' && selectedClient) {
      // console.log('Closing activity modal while preserving a selected client:', selectedClient._id);
      // Force a refresh of the client data to ensure it's not lost
      setTimeout(() => {
        if (selectedClient) {
          // console.log('Refreshing client data after modal close');
          setSelectedClient({ ...selectedClient });
        }
      }, 100);
    }

    setActivityModalOpen(state);
  };

  // ✅ Prevent hydration mismatch by rendering only after mount
  if (!isMounted) return null;

  // Get grid classes based on layout
  const getGridClasses = () => {
    if (layoutConfig.isNarrow) {
      return 'grid-cols-1 gap-3';
    } else if (layoutConfig.isMedium) {
      return 'grid-cols-1 md:grid-cols-2 gap-4';
    } else {
      return 'grid-cols-1 md:grid-cols-2 gap-5';
    }
  };

  return (
    <div
      className={`relative h-full w-full flex-[4] transition-transform duration-800 ease-in-out ${
        slideState === 'out'
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100'
      }`}
      id="client-profile-root"
      data-client-id={selectedClient?._id || ''}
      ref={profileRef}
    >
      {/* No client selected a message */}
      {!selectedClient && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200/80 z-50">
          <div className="text-center p-8 rounded-lg bg-base-100 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">No Client Selected</h2>
            <p>Please select a client from the list to view their profile.</p>
          </div>
        </div>
      )}

      {/* Width debug indicator */}
      {/*{process.env.NODE_ENV === 'development' && (*/}
      {/*  <div className="absolute top-2 right-2 z-50 bg-base-300 text-xs px-2 py-1 rounded-md opacity-50">*/}
      {/*    Width: {containerWidth}px |*/}
      {/*    {layoutConfig.isNarrow? 'Narrow': layoutConfig.isMedium? 'Medium': 'Wide'}*/}
      {/*  </div>*/}
      {/*)}*/}

      <div
        className={`no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll`}
      >
        <ClientProfileHeader setOpenPanel={setOpenPanel} />
        <div className={`mt-[30px] grid ${getGridClasses()}`}>
          <div className={`${layoutConfig.isNarrow ? 'col-span-1' : 'col-span-2'}`}>
            <ClientProfilePersonalOrganization
              isNarrow={layoutConfig.isNarrow}
              isMedium={layoutConfig.isMedium}
            />
          </div>
          <div className={`${layoutConfig.isNarrow ? 'col-span-1' : 'col-span-2'}`}>
            <ClientProfileProgress
              hasTrackableCopy={hasTrackableCopy}
              hasTrackable={hasTrackable}
              setHasTrackable={setHasTrackable}
              updated={updated}
              setUpdated={setUpdated}
              isNarrow={layoutConfig.isNarrow}
              isMedium={layoutConfig.isMedium}
            />
          </div>
          <div className={`col-span-1`}>
            <CombinedFeed isNarrow={layoutConfig.isNarrow} />
          </div>
          <div className={`col-span-1`}>
            <ClientProfileTABEOrientation isNarrow={layoutConfig.isNarrow} />
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        open={activityModalOpen}
        setOpen={handleActivityModalOpen}
        onSuccess={handleActivitySuccess}
      />
    </div>
  );
}
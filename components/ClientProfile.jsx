"use client";
import React, { useEffect, useRef, useState } from "react";
import CombinedFeed from "./CombinedFeed";
import ClientProfilePersonalOrganization from "../components/ClientProfilePersonalOrganization";
import ClientProfileTABEOrientation from "../components/ClientProfileTABEOrientation";
import { useClient } from "/contexts/ClientContext";
import ActivityModal from "../components/ActivityModal";
import { useLayout } from "/contexts/LayoutContext";
import ClientProfileProgress from "./ClientProfileProgress";

export default function ClientProfile() {
  const [isMounted, setIsMounted] = useState(false);
  const { selectedClient, setSelectedClient } = useClient();
  const [, setActions] = useState([]); // activities are the activities
  const [, setHasTrackable] = useState([]);
  const [hasTrackableUpdated, setHasTrackableUpdated] = useState(false);
  const [, setHasTrackableCopy] = useState([]);
  const [activityModalOpen, setActivityModalOpen] = useState("");
  const [slideState, setSlideState] = useState("out"); // "in" or "out"
  const { currentLayout } = useLayout();
  const profileRef = useRef(null);
  const [referralResults, setReferralResults] = useState("");
  const [graduationResults, setGraduationResults] = useState("");

  // State for tracking container width and layout config
  const [, setContainerWidth] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState({
    isNarrow: false,
    isMedium: false,
    isWide: true,
  });

  const resultsOfReferral = [
    "BTC",
    "Catholic Multicultural Center",
    "ESL Classes",
    "Enrolled",
    "Fox Valley Technical College",
    "LTC",
    "Literacy Council",
    "Literacy Green Bay",
    "Literacy Green Bay GED program",
    "Literacy Network",
    "MPTC",
    "Madison College",
    "Mid-State",
    "NWTC GED Program",
    "Nicholet",
    "Northcentral Technical College",
    "Northwoods Technical College",
    "Octonto Literacy Council",
    "Omega",
    "Oneida CEC",
    "Portage County Literacy Council",
    "ShawNo Literacy",
    "South West Technical College",
    "Western Technical College",
    "atWestern Tech",
  ];

  const resultsOfGraduation = [
    "Acts of Kindness for household items",
    "Alison.com",
    "Alternative Center for Education",
    "BHS Auto Mechanic",
    "Beloit City Transport",
    "Beloit Community Action",
    "Beloit HS-Auto Repair",
    "Beloit High School",
    "Bio Life for a job",
    "Bridgeways",
    "Caritas - Diapers & Food Pantry",
    "Codes issued for RLA",
    "Community Kids Learning Center",
    "Dr. Francine Nelson",
    "Echo",
    "Economic Support",
    "Emergency Assistance",
    "FSET for Driver's license help",
    "Financial Assistance",
    "GALE",
    "Head Start in Merrill",
    "Kaplan GED Prep",
    "Legal Aid",
    "Manitowoc Lit Council",
    "Project 16:49",
    "SAMSHA Virtual Training",
    "SWWDB for Scholarships",
    "Sheboygan Area Pay it Forward",
    "Test Prep Champions",
    "Texas Education Agency for Transcripts",
    "TrANS Program.",
    "Two Worlds One Heart Child care",
    "Wisconsin Center for the Blind and Visually Impaired",
    "referred to GED Math tutor",
    "ACE",
    "ADVOCAP",
    "ATB",
    "Affordable Connectivty",
    "BTC Care Center",
    "Beloit Transit",
    "Blackhawk Technical College",
    "Brown County Library",
    "CNA Programs",
    "Catholic Multicultural Center",
    "Community Action",
    "Crisis Center",
    "DVR",
    "EN Program",
    "ESL Classes",
    "FSC Computer Lab",
    "FSC Job Search Essentials",
    "FSET",
    "Faith Works",
    "Fox Valley Technical College",
    "GED Prep Worksheets",
    "GED.com",
    "Green Bay Literacy Council",
    "Hagar House",
    "Head Start",
    "Job Developer",
    "Juno Library",
    "Kahoots",
    "Khan Academy",
    "LTC",
    "Lakeshore CAP",
    "Lakeshore Community Center",
    "Library",
    "Literacy Green Bay",
    "Literacy Network",
    "Literacy Network of Dane County",
    "Literacy Services of Wisconsin",
    "Logistics - FSC",
    "Lutheran Social Services",
    "MPTC",
    "Madison College",
    "Mobility Manager",
    "Moraine Park Tech",
    "NCTC",
    "NEWCAP",
    "NTC - Ability to Benefit",
    "New Life Church Coat Drive",
    "Northwoods Technical College",
    "Octonto Literacy Council",
    "Oneida Community Education Center",
    "Online Math Tutor",
    "Open Doors for Refugees",
    "Oregon Library",
    "PCs for people",
    "Portage County Literacy Council",
    "Pregnancy Helpline",
    "Referred",
    "South West Technical College",
    "St Vincent de Paul",
    "State Line Literacy",
    "Test Prep Insight",
    "The Salvation Army",
    "USAHello",
    "WIOA",
    "WOWI",
    "Waukesha Tech",
    "Western Technical College",
    "Work Smart",
    "ability to benefit",
    "liheap",
    "safe families",
  ];

  // Watch for changes to the selectedClient and animate accordingly
  useEffect(() => {
    if (selectedClient) {
      // If a client is selected, slide in
      setSlideState("in");
    } else {
      // If no client is selected, slide out
      setSlideState("out");
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
        isWide: false,
      });
    } else if (width < 800) {
      setLayoutConfig({
        isNarrow: false,
        isMedium: true,
        isWide: false,
      });
    } else {
      setLayoutConfig({
        isNarrow: false,
        isMedium: false,
        isWide: true,
      });
    }
  };

  useEffect(() => {
    setIsMounted(true); // ✅ Mark component as mounted before interacting with localStorage
    if (typeof window !== "undefined") {
      // Only set up a modal function if it doesn't already exist
      if (!window.openActivityModal) {
        // console.log('Setting up openActivityModal from ClientProfile');
        window.openActivityModal = () => {
          // Only allow opening the activity modal if a client is selected
          if (selectedClient) {
            // console.log('Opening activity modal from ClientProfile');
            setActivityModalOpen("activity");
          } else {
            console.warn("Cannot open activity modal: No client selected");
          }
        };
      }

      // Listen for trackable updates
      const handleTrackableUpdate = (event) => {
        // console.log('Received trackableUpdated event in ClientProfile:', event.detail);

        // Get the current selected client from the data attribute
        const currentClientId = document.getElementById("client-profile-root")
          ?.dataset?.clientId;

        if (
          event.detail &&
          event.detail.trackable &&
          event.detail.clientId &&
          (currentClientId === event.detail.clientId ||
            (selectedClient && selectedClient._id === event.detail.clientId))
        ) {
          // console.log('Applying trackable update to the current client');

          // Schedule update for the next render cycle
          setTimeout(() => {
            try {
              // Get the latest selected client inside the timeout
              const latestSelectedClient = document.getElementById(
                "client-profile-root",
              )?.dataset?.clientId
                ? {
                    _id: document.getElementById("client-profile-root")?.dataset
                      ?.clientId,
                  }
                : selectedClient;

              if (!latestSelectedClient) {
                console.warn("No client available to update trackable data");
                return;
              }

              // Update client with new trackable data
              const updatedClient = {
                ...latestSelectedClient,
                trackable: event.detail.trackable,
              };

              // console.log('Updating client with trackable data:', updatedClient);
              setSelectedClient(updatedClient);

              // Update local trackable state
              setHasTrackable(event.detail.trackable.items || []);
              setHasTrackableCopy(
                JSON.parse(JSON.stringify(event.detail.trackable.items || [])),
              );
              setHasTrackableUpdated(true);
            } catch (error) {
              console.error(
                "Error updating client with trackable data:",
                error,
              );
            }
          }, 0);
        }
      };

      // Add event listener
      window.addEventListener("trackableUpdated", handleTrackableUpdate);

      // Clean up
      return () => {
        window.removeEventListener("trackableUpdated", handleTrackableUpdate);
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
      if (
        selectedClient.trackable &&
        Array.isArray(selectedClient.trackable.items)
      ) {
        // console.log('ClientProfile: Setting hasTrackable from a client', selectedClient.trackable);
        setHasTrackable(selectedClient.trackable.items);

        // Only create a copy if it hasn't been updated yet
        if (!hasTrackableUpdated) {
          const copy = JSON.parse(
            JSON.stringify(selectedClient.trackable.items),
          );
          setHasTrackableCopy(copy);
          setHasTrackableUpdated(true);
        }

        // Check localStorage for cached trackable state
        if (typeof window !== "undefined") {
          try {
            const cachedTrackable = localStorage.getItem(
              `trackable-${selectedClient._id}`,
            );
            if (cachedTrackable) {
              const parsed = JSON.parse(cachedTrackable);

              // Only use cached data if it has an item array
              if (parsed && Array.isArray(parsed.items)) {
                const cachedCompleted = parsed.items.filter(
                  (item) => item && item.completed,
                ).length;
                const currentCompleted = selectedClient.trackable.items.filter(
                  (item) => item && item.completed,
                ).length;

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
                        items: parsed.items,
                      },
                    };
                    setSelectedClient(updatedClient);
                  }, 0);
                }
              }
            }
          } catch (e) {
            console.error("Error reading cached trackable", e);
          }
        }
      } else if (
        selectedClient.trackable &&
        !Array.isArray(selectedClient.trackable.items)
      ) {
        // Handle invalid trackable data by initializing empty arrays
        console.warn("Client has trackable but no valid items array");
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
            items: (result.trackable.items || []).map((item) => ({
              ...item,
              // Preserve savedInDatabase flag if it exists, otherwise default to false
              savedInDatabase: item.savedInDatabase === true,
            })),
          };

          const updatedClient = {
            ...selectedClient,
            trackable: trackableWithTimestamp,
          };
          setSelectedClient(updatedClient);

          // Update local state but preserve savedInDatabase flags
          setHasTrackable(trackableWithTimestamp.items);

          // For hasTrackableCopy, only mark items as completed if they're saved in a database
          const itemsForCopy = trackableWithTimestamp.items.map((item) => ({
            ...item,
            completed: item.savedInDatabase === true ? item.completed : false,
          }));

          setHasTrackableCopy(itemsForCopy);
          setHasTrackableUpdated(true);
        }, 0);
      }
    }
  };

  // Handle closing the activity modal when there's no selected client
  const handleActivityModalOpen = (state) => {
    // console.log('Activity modal open state changing from', activityModalOpen, 'to', state);

    // if (!selectedClient && state) {
    //   console.warn('Cannot open activity modal: No client selected');
    //   if (typeof window !== 'undefined' && typeof window.showNotification === 'function') {
    //     window.showNotification({
    //       title: 'No Client Selected',
    //       message: 'Please select a client before adding an activity.',
    //       type: 'warning',
    //       duration: 3000
    //     });
    //   }
    //   return;
    // }

    // If we're closing the modal, make sure we preserve the selected client
    if (state === "" && selectedClient) {
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
      return "grid-cols-5 gap-3";
    } else if (layoutConfig.isMedium) {
      return "grid-cols-4 md:grid-cols-5 gap-4";
    } else {
      return "grid-cols-4 md:grid-cols-5 gap-5";
    }
  };

  const handleResultsChange = async () => {
    await setSelectedClient((prev) => ({
      ...prev,
      graduationResults,
      referralResults,
    }));

    const res = await fetch(`/api/clients?clientId=${selectedClient._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedClient),
    }).then();
    const data = await res.json();
    await setSelectedClient(data.client);
  };

  return (
    <div
      className={`relative h-full w-full flex-[4] transition-transform duration-800 ease-in-out ${
        slideState === "out"
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      }`}
      id="client-profile-root"
      data-client-id={selectedClient?._id || ""}
      ref={profileRef}
    >
      {/* No client selected a message */}
      {!selectedClient && (
        <div className="bg-base-200/80 absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-base-100 rounded-lg p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">No Client Selected</h2>
            <p>Please select a client from the list to view their profile.</p>
          </div>
        </div>
      )}

      <div
        className={`no-scrollbar absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll`}
      >
        <div className={`grid ${getGridClasses()}`}>
          <div
            className={`${layoutConfig.isNarrow ? "col-span-1" : "col-span-5"}`}
          >
            <ClientProfilePersonalOrganization
              isNarrow={layoutConfig.isNarrow}
              isMedium={layoutConfig.isMedium}
            />
          </div>
          <div
            className={`${layoutConfig.isNarrow ? "col-span-1" : "col-span-5"}`}
          >
            {selectedClient?.group === "adult" && (
              <ClientProfileProgress
                isNarrow={layoutConfig.isNarrow}
                isMedium={layoutConfig.isMedium}
              />
            )}
          </div>

          <div className={`col-span-2`}>
            <ClientProfileTABEOrientation isNarrow={layoutConfig.isNarrow} />
          </div>
          <div
            className={`${layoutConfig.isNarrow ? "col-span-3" : "col-span-5"}`}
          >
            <CombinedFeed isNarrow={layoutConfig.isNarrow} />
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
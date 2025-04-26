'use client';
import React, { useEffect, useState } from 'react';
import ClientProfile from './ClientProfile';
import ActivityModal from './ActivityModal';

export default function ClientProfileWithActivity({ setOpenPanel }) {
  const [open, setOpen] = useState('');

  // Set up the global openActivityModal function and event listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Define global function to open activity modal
      window.openActivityModal = () => {
        // console.log('Opening activity modal from ClientProfileWithActivity');
        setOpen('activity');
      };

      // Also listen for custom events
      const handleActivityModalEvent = (event) => {
        // console.log('Activity modal event received:', event.detail);
        if (event.detail && event.detail.open) {
          setOpen(event.detail.open);
        }
      };

      window.addEventListener('openActivityModal', handleActivityModalEvent);
    }

    // Clean up on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.openActivityModal;
        window.removeEventListener('openActivityModal', handleActivityModalEvent);
      }
    };
  }, []);

  // Handle successful activity addition
  const handleActivitySuccess = (result) => {
    // console.log('Activity success in ClientProfileWithActivity:', result);

    // Create a custom event that the CombinedFeed component can listen for
    if (typeof window !== 'undefined') {
      try {
        // console.log('Dispatching activityAdded event from client profile wrapper');

        // Make sure the result has an _id and flag it as an optimistic update
        const enhancedResult = {
          ...result,
          _id: result._id || result.insertedId || result.data?._id || `profile-temp-${Date.now()}`,
          isOptimistic: true, // Mark as optimistic so it's preserved during refreshes
          timestamp: new Date().toISOString(), // Ensure it has a timestamp
          createdAt: new Date().toISOString(),
          // Add a persistence flag to ensure it isn't removed
          isPermaPersistent: true
        };

        // Dispatch activity added event
        const activityAddedEvent = new CustomEvent('activityAdded', {
          detail: enhancedResult,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(activityAddedEvent);

        // Also dispatch a trackable update event if this activity has trackable data
        if (result.trackable) {
          // console.log('Dispatching trackableUpdated event for trackable activity');
          const trackableEvent = new CustomEvent('trackableUpdated', {
            detail: {
              clientId: result.clientId || result.data?.clientId,
              trackable: result.trackable,
              timestamp: new Date().toISOString()
            },
            bubbles: true,
            cancelable: true
          });
          window.dispatchEvent(trackableEvent);
        }

        // Store in localStorage as a backup - will be restored if the activity disappears
        if (result.clientId) {
          try {
            const storedActivities = JSON.parse(
              localStorage.getItem(`tempActivities-${result.clientId}`) || '[]'
            );
            storedActivities.push(enhancedResult);
            localStorage.setItem(
              `tempActivities-${result.clientId}`,
              JSON.stringify(storedActivities)
            );
          } catch (e) {
            console.error('Failed to store activity in localStorage:', e);
          }
        }
      } catch (error) {
        console.error('Error in handleActivitySuccess:', error);
      }
    }
  };

  return (
    <>
      <ClientProfile setOpenPanel={setOpenPanel} />
      <ActivityModal
        open={open}
        setOpen={setOpen}
        onSuccess={handleActivitySuccess}
      />
    </>
  );
}
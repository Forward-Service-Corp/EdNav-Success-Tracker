'use client';
import React, { useEffect, useState } from 'react';
import ClientProfile from './ClientProfile';
import ActivityModal from './ActivityModal';

export default function ClientProfileWithActivity({ setOpenPanel }) {
  const [open, setOpen] = useState('');

  // Set up the global openActivityModal function
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Define global function to open activity modal
      window.openActivityModal = () => {
        setOpen('activity');
      };
    }

    // Clean up on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.openActivityModal;
      }
    };
  }, []);

  // Handle successful activity addition
  const handleActivitySuccess = (result) => {
    console.log('Activity success in ClientProfileWithActivity:', result);

    // Create a custom event that the CombinedFeed component can listen for
    if (typeof window !== 'undefined') {
      try {
        console.log('Dispatching activityAdded event from client profile wrapper');

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

        const activityAddedEvent = new CustomEvent('activityAdded', {
          detail: enhancedResult,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(activityAddedEvent);

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

        /* Disabled automatic refresh to prevent activities from disappearing
        setTimeout(() => {
          console.log('Triggering manual refresh after activity added');
          if (window.refreshActivityFeed) {
            window.refreshActivityFeed();
          }
        }, 10000); // 10 seconds
        */
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
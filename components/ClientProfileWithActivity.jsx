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

        // Make sure the result has an _id
        const enhancedResult = {
          ...result,
          _id: result._id || result.insertedId || result.data?._id || `profile-temp-${Date.now()}`
        };

        const activityAddedEvent = new CustomEvent('activityAdded', {
          detail: enhancedResult,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(activityAddedEvent);

        // Force a manual refresh of activities after a short delay
        setTimeout(() => {
          console.log('Triggering manual refresh after activity added');
          if (window.refreshActivityFeed) {
            window.refreshActivityFeed();
          }
        }, 1000);
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
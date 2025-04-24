"use client";
import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import ActivityDynamicSelect from './ActivityDynamicSelect';

export default function ActivityModal({ open, setOpen, onSuccess }) {
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    let cleanedQuestions = {};
    try {
      const response = await fetch("/api/questions");
      const questions = await response.json();
      const { adult, youth } = await questions;
      cleanedQuestions.adult = adult;
      cleanedQuestions.youth = youth;
      setQuestions(cleanedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Set default empty structure if questions can't be loaded
      cleanedQuestions = { adult: {}, youth: {} };
      setQuestions(cleanedQuestions);
    }
    return cleanedQuestions;
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // When an activity is successfully added, pass it to parent components
  const handleActivitySuccess = (result) => {
    console.log('Activity successfully added, result:', result);

    // Make sure we have a valid result with necessary data
    if (!result) {
      console.error('No result from activity submission');
      return;
    }

    try {
      // Add the activity directly to the feed
      if (typeof window !== 'undefined' && window.addActivityToFeed) {
        console.log('Adding activity to feed via global function');

        // Extract the activity data from the result
        const activityData = result.activity || result.data || result;

        // Create a properly formatted activity for the feed
        // with a special modal ID so we can identify it as an optimistic update
        const activityForFeed = {
          ...activityData,
          _id: activityData._id || `modal-${Date.now()}`,
          type: 'activity',
          date: new Date(activityData.timestamp || activityData.createdAt || Date.now()),
          statement: activityData.statement || 'Activity recorded',
          navigator: activityData.navigator || 'System',
          isOptimistic: true // Flag to identify optimistic updates
        };

        console.log('Formatted activity for feed:', activityForFeed);

        // Add it to the feed via the global function - this immediately shows in the UI
        window.addActivityToFeed(activityForFeed);

        // Dispatch a custom event that components can listen for
        console.log('Dispatching activityAdded event');
        const activityAddedEvent = new CustomEvent('activityAdded', {
          detail: activityForFeed,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(activityAddedEvent);
      } else {
        console.warn('window.addActivityToFeed is not available');
      }

      // Call the provided onSuccess callback
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error in handleActivitySuccess:', error);
    } finally {
      // Always close the modal regardless of success/failure
      console.log('Closing activity modal');
      setOpen('');
    }
  };

  return (
    <Dialog
      open={open === "activity"}
      onClose={() => setOpen("")}
      className="relative z-60"
    >
      <DialogBackdrop
        transition
        className="bg-base-300/30 fixed inset-0 blur-sm backdrop-blur-xs transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
      />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="bg-base-100 relative transform overflow-hidden rounded-lg p-12 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          <div className="px-12 py-8">
            <div>
              <DialogTitle
                as="h3"
                className="text-base-content mx-auto max-w-60 text-xl font-light"
              >
                Add an activity
              </DialogTitle>
              <div className="">
                <ActivityDynamicSelect
                  setOpen={setOpen}
                  questions={questions}
                  onSuccess={handleActivitySuccess}
                />
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

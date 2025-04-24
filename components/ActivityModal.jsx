'use client';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import ActivityDynamicSelect from './ActivityDynamicSelect';

export default function ActivityModal({ open, setOpen, onSuccess }) {
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    let cleanedQuestions = {};
    try {
      const response = await fetch('/api/questions');
      const questions = await response.json();
      const { adult, youth } = await questions;
      cleanedQuestions.adult = adult;
      cleanedQuestions.youth = youth;
      setQuestions(cleanedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Set the default empty structure if questions can't be loaded
      cleanedQuestions = { adult: {}, youth: {} };
      setQuestions(cleanedQuestions);
    }
    return cleanedQuestions;
  };

  // Add activity directly to the feed (for optimistic updates)
  const addActivitySimplified = () => {
    // placeholder for optimistic updates
  };

  useEffect(() => {
    getQuestions().then();
    window.addActivitySimplified = addActivitySimplified;
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
      // First check if simplified approach is available
      if (typeof window !== 'undefined' && window.addActivitySimplified) {
        console.log('Using simplified activity approach with optimistic updates');

        // Extract the activity data from the result
        const activityData = result.activity || result.data || result;

        // Add directly via API with optimistic update built in
        window.addActivitySimplified(activityData).then();
      }
      // Fall back to the original approach if simplified is not available
      else if (typeof window !== 'undefined' && window.addActivityToFeed) {
        console.log('Using original activity approach as fallback');

        // Extract the activity data from the result
        const activityData = result.activity || result.data || result;

        // Skip meaningless activities
        if (!activityData.statement && !activityData.description &&
          !activityData.details && !activityData.category) {
          console.log('Skipping activity with no meaningful content');
          setOpen('');
          return;
        }

        // Create an optimistic update with our simplified approach if available
        if (typeof window !== 'undefined' && window.optimisticallyAddActivity) {
          const optimisticActivity = {
            ...activityData,
            _id: `modal-opt-${Date.now()}`,
            type: 'activity',
            date: new Date(activityData.timestamp || activityData.createdAt || Date.now()),
            statement: activityData.statement || 'Activity recorded',
            navigator: activityData.navigator || 'System',
            isOptimistic: true
          };

          window.optimisticallyAddActivity(optimisticActivity);
        }
        // Otherwise use the original approach
        else {
          window.addActivityToFeed(activityData);
        }
      } else {
        console.warn('No activity management method available');
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
      open={open === 'activity'}
      onClose={() => setOpen('')}
      className="relative z-60"
    >
      <DialogBackdrop
        transition
        className="bg-base-300/30  inset-0 blur-sm backdrop-blur-xs transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
      />
      <div
        className="flex min-h-full min-w-full items-end justify-center p-4 text-center sm:items-center sm:p-0 relative border-5 border-pink-500">
        <DialogPanel
          transition
          className="bg-base-100 relative transform overflow-hidden rounded-lg p-12 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          {/*<DialogTitle*/}
          {/*  as="h3"*/}
          {/*  className="text-base-content mx-auto max-w-60 text-xl font-light"*/}
          {/*>*/}
          {/*  Add an activity*/}
          {/*</DialogTitle>*/}
          <ActivityDynamicSelect
            setOpen={setOpen}
            questions={questions}
            onSuccess={handleActivitySuccess}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}

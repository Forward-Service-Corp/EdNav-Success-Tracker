'use client';
import React, { useEffect, useState } from 'react';
import ActivityDynamicSelect from './ActivityDynamicSelect';

export default function ActivityModal({ open, setOpen, onSuccess }) {
  const [questions, setQuestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  console.log('ActivityModal rendering with open state:', open);

  // Force visibility when open changes
  useEffect(() => {
    console.log('ActivityModal open state changed to:', open);
    if (open === 'activity') {
      setIsVisible(true);
      // Add a body class to prevent scrolling
      document.body.classList.add('modal-open');
    } else {
      setIsVisible(false);
      document.body.classList.remove('modal-open');
    }
  }, [open]);

  const getQuestions = async () => {
    let cleanedQuestions = {};
    try {
      const response = await fetch('/api/questions');
      const questions = await response.json();
      const { adult, youth } = await questions;
      cleanedQuestions.adult = adult;
      cleanedQuestions.youth = youth;
      setQuestions(cleanedQuestions);
      console.log('Questions loaded:', cleanedQuestions);
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
    console.log('addActivitySimplified called');
  };

  useEffect(() => {
    console.log('ActivityModal mounted');
    getQuestions().then();
    window.addActivitySimplified = addActivitySimplified;

    return () => {
      console.log('ActivityModal unmounted');
    };
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
        window.addActivitySimplified(activityData);
        console.log(window.addActivitySimplified(activityData));
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

  // If not open, don't render anything
  if (open !== 'activity' && !isVisible) {
    return null;
  }

  // Fallback to a simpler modal implementation that doesn't depend on headlessui
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop/overlay */}
      <div
        className="fixed inset-0 bg-base-300/50 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen('')}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center ">
        <div
          className="w-full max-w-md transform overflow-hidden rounded-2xl z-100 bg-base-300 text-base-content p-6 text-left align-middle shadow-xl transition-all"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6">
              Add an activity
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setOpen('')}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <ActivityDynamicSelect
            setOpen={setOpen}
            questions={questions}
            onSuccess={handleActivitySuccess}
          />
        </div>
      </div>
    </div>
  );
}
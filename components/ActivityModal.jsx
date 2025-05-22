"use client";
import React, { useEffect, useState } from "react";
import ActivityDynamicSelect from "./ActivityDynamicSelect";
import { useClient } from "/contexts/ClientContext";

export default function ActivityModal({ open, setOpen, onSuccess }) {
  const [questions, setQuestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { selectedClient } = useClient();
  console.log("ActivityModal open:", open);
  // console.log("ActivityModal selectedClient:", selectedClient);
  // console.log('ActivityModal isVisible:', isVisible);

  // Turbo-hammered modal state reset to forcibly restart animation/render cycle on every open
  useEffect(() => {
    let timeout;
    if (open === "activity") {
      if (!selectedClient) {
        timeout = setTimeout(() => {
          if (!selectedClient) {
            console.warn("Still no client selected. Closing modal.");
            if (typeof setOpen === "function") {
              setOpen("");
            }
          }
        }, 200);
      } else {
        // Blast it closed then openly again with enough spacing to bypass React's laziness
        setIsVisible(false);
        timeout = setTimeout(() => {
          setIsVisible(true);
          document.body.classList.add("modal-open");
        }, 10); // give it a tick
      }
    } else {
      setIsVisible(false);
      document.body.classList.remove("modal-open");
    }

    return () => clearTimeout(timeout);
  }, [open, selectedClient, setOpen]);

  const getQuestions = async () => {
    let cleanedQuestions = {};
    try {
      const response = await fetch("/api/questions");
      const questions = await response.json();
      const { adult, youth } = await questions;
      cleanedQuestions.adult = adult;
      cleanedQuestions.youth = youth;
      setQuestions(cleanedQuestions);
      // console.log('Questions loaded:', cleanedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Set the default empty structure if questions can't be loaded
      cleanedQuestions = { adult: {}, youth: {} };
      setQuestions(cleanedQuestions);
    }
    return cleanedQuestions;
  };

  useEffect(() => {
    // console.log('ActivityModal mounted');
    getQuestions().then();

    return () => {
      // console.log('ActivityModal unmounted');
    };
  }, [selectedClient]);

  // When an activity is successfully added, pass it to parent components
  const handleActivitySuccess = (result) => {
    // console.log('Activity successfully added, result:', result);

    // Make sure we have a valid result with necessary data
    if (!result) {
      console.error("No result from activity submission");
      return;
    }

    try {
      // Extract the activity data from the result
      const activityData = result.activity || result.data || result;

      if (["GED", "HSED", "GED/HSED"].includes(activityData?.selection)) {
        document.body.classList.add("progress-onboarding");
        // Optional: set a flag in localStorage or state to show the onboarding dialog
      }

      if (
        !activityData.selection ||
        !["GED", "HSED", "GED/HSED"].includes(activityData.selection)
      ) {
        if (
          !activityData.statement &&
          !activityData.description &&
          !activityData.details &&
          !activityData.category
        ) {
          setOpen("client");
          return;
        }
      }

      if (typeof window !== "undefined" && window.addActivityToFeed) {
        window.addActivityToFeed(activityData);
      } else {
        console.warn("No activity management method available");
      }

      // Call the provided onSuccess callback
      if (onSuccess) {
        // console.log('Calling onSuccess callback');
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error in handleActivitySuccess:", error);
    } finally {
      // Always close the modal after a short delay to allow state updates to complete
      // console.log('Scheduling activity modal close');
      setTimeout(() => {
        // console.log('Closing activity modal');
        setOpen("");
      }, 500); // Add a small delay to prevent race conditions with state updates
    }
  };

  // If not open, don't render anything
  if (open !== "activity" && !isVisible) {
    return null;
  }

  // If no client is selected, don't render the form
  if (!selectedClient) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop/overlay */}
        <div
          className="bg-base-300/50 fixed inset-0 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen("")}
        />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            className="bg-base-300 text-base-content z-100 w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium">
                No Client Selected
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setOpen("")}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 text-center">
              <p>Please select a client before adding an activity.</p>
              <button
                className="mt-4 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                onClick={() => setOpen("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to a simpler modal implementation that doesn't depend on headless
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop/overlay */}
      <div
        className="bg-base-300/50 fixed inset-0 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen("")}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="bg-base-300 text-base-content z-100 w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium">
              Add an activity for {selectedClient.first_name}{" "}
              {selectedClient.last_name}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setOpen("")}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
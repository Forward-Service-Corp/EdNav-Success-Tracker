import React, { useEffect, useState } from "react";
import { useClient } from "../contexts/ClientContext";
import ProgressButton from "./ProgressButton";

function ClientProfileProgress({ hasTrackable, isNarrow }) {
  const { selectedClient, setSelectedClient } = useClient();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [displayItems, setDisplayItems] = useState(selectedClient?.items); // Combined items for display

  // // Initialize our state when hasTrackable changes
  useEffect(() => {
    if (Array.isArray(hasTrackable) && hasTrackable.length > 0) {
      // Calculate completion based on display items
      const percentage = calculateCompletionPercentage(displayItems);
      setCompletionPercentage(percentage);
    } else {
      setDisplayItems([]);
      setCompletionPercentage(0);
    }
  }, [selectedClient]);

  // Update the display items whenever savedItems or newSelections change
  useEffect(() => {
    // Update display items
    setDisplayItems(selectedClient?.items);

    // Also calculate completion percentage
    const percentage = calculateCompletionPercentage(selectedClient?.items);
    setCompletionPercentage(percentage);

    // Mark as updated if there are new selections
    // setUpdated(newSelections.length > 0);
  }, [hasTrackable, selectedClient]);

  function calculateCompletionPercentage(items) {
    if (!Array.isArray(items) || items.length === 0) return 0;

    // Only count trackable items, not the program selection itself
    const completedCount = items.filter(
      (item) => item && item.completed === true,
    ).length;
    const totalCount = items.length;

    return ((completedCount / totalCount) * 100).toFixed(1);
  }

  const handleSaveProgress = async (index) => {
    const updatedItems = [...selectedClient.items];
    updatedItems[index] = { ...updatedItems[index], completed: true };
    setSelectedClient({ ...selectedClient, items: updatedItems });
    try {
      const response = await fetch(
        `/api/clients/trackable-progress?id=${selectedClient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: selectedClient?.items }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      setDisplayItems(updatedItems);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Determine if the progress area should be visible based on client data
  const isProgressVisible =
    selectedClient?.trackable?.program === "GED" ||
    selectedClient?.trackable?.program === "HSED" ||
    (typeof window !== "undefined" &&
      selectedClient?._id &&
      selectedClient?.trackable?.program === "GED/HSED");

  // Function to safely render trackable items
  const renderTrackableItems = () => {
    return selectedClient?.items?.map((item, index) => {
      return (
        <ProgressButton
          item={item}
          index={index}
          isDisabled={item?.completed}
          onSave={handleSaveProgress}
          key={`item-${index}`}
        />
      );
    });
  };

  return (
    <div className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${isProgressVisible ? "invisible" : "visible"}`}
      >
        <div
          className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded p-6 text-center shadow`}
        >
          Add an activity regarding GED or HSED to activate this area.
        </div>
      </div>
      <div
        className={`bg-base-200 relative rounded shadow ${isProgressVisible ? "" : "opacity-50 blur-[2px]"}`}
        data-testid="progress-area"
      >
        <div className="p-6">
          <div className={`mt-0 mb-4 flex items-center justify-between pb-3`}>
            <div className={`flex flex-col gap-1`}>
              <div
                className={`${isNarrow ? "text-lg" : "text-xl"} font-light tracking-wider uppercase`}
              >
                {selectedClient?.trackable?.program || "Program"} Progress -{" "}
                {completionPercentage}%
              </div>
              <p className={`text-info text-sm`}>
                Click items to mark them as completed.
              </p>
              <p className={`mt-1 text-xs opacity-70`}>
                <span className="font-medium">Note:</span> Items saved to the
                database cannot be unchecked.
              </p>
            </div>
          </div>
          <div className="card-actions justify-end">
            <progress
              className="progress progress-success h-6 w-full"
              value={completionPercentage}
              max="100"
            ></progress>
            <div className={`mt-6 flex flex-wrap gap-4`}>
              {renderTrackableItems()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default props
ClientProfileProgress.defaultProps = {
  isNarrow: false,
  isMedium: false,
};

export default ClientProfileProgress;
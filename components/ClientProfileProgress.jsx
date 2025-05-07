import React, { useEffect, useState } from 'react';
import { useClient } from '../contexts/ClientContext';
import ProgressButton from './ProgressButton';

function ClientProfileProgress({
                                 hasTrackable,
                                 isNarrow
                               }) {
  const { selectedClient } = useClient();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [displayItems, setDisplayItems] = useState(selectedClient?.trackable?.items); // Combined items for display

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
    setDisplayItems(selectedClient?.trackable?.items);

    // Also calculate completion percentage
    const percentage = calculateCompletionPercentage(selectedClient?.trackable?.items);
    setCompletionPercentage(percentage);

    // Mark as updated if there are new selections
    // setUpdated(newSelections.length > 0);
  }, [hasTrackable, selectedClient]);


  function calculateCompletionPercentage(items) {
    if (!Array.isArray(items) || items.length === 0) return 0;

    // Only count trackable items, not the program selection itself
    const completedCount = items.filter((item) => item && item.completed === true).length;
    const totalCount = items.length;

    return ((completedCount / totalCount) * 100).toFixed(1);
  }

  // Determine if the progress area should be visible based on client data
  const isProgressVisible = selectedClient?.trackable?.program === 'GED' ||
    selectedClient?.trackable?.program === 'HSED' ||
    (typeof window !== 'undefined' && selectedClient?._id && selectedClient?.trackable?.program === 'GED/HSED');

  // Function to safely render trackable items
  const renderTrackableItems = () => {

    return selectedClient?.trackable?.items?.map((item, index) => {

      return (
        <ProgressButton
          item={item}
          index={index}
          isDisabled={item?.completed}
          key={`item-${index}`} />
      );
    });
  };

  return (
    <div className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${isProgressVisible ? 'invisible' : 'visible'}`}
      >
        <div
          className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded p-6 text-center shadow`}
        >
          Add an activity regarding GED or HSED to activate this area.
        </div>
      </div>
      <div
        className={`bg-base-200 relative rounded shadow ${isProgressVisible ? '' : 'opacity-50 blur-[2px]'}`}
        data-testid="progress-area"
      >
        <div className="card-body">
          <div className={`mt-0 mb-4 flex items-center justify-between`}>
            <div>
              <div className={`${isNarrow ? 'text-lg' : 'text-xl'} uppercase font-light tracking-wider`}>
                {selectedClient?.trackable?.program || 'Program'} Progress -{' '}
                {completionPercentage}%
              </div>
              <p className={`text-info text-sm`}>
                Click items to mark them as completed.
              </p>
              <p className={`text-xs opacity-70 mt-1`}>
                <span className="font-medium">Note:</span> Items saved to the database cannot be unchecked.
              </p>
            </div>
          </div>
          <div className="card-actions justify-end">
            <progress
              className="progress progress-success w-full"
              value={completionPercentage}
              max="100"
            ></progress>
            <div className={`mt-4 flex flex-wrap gap-3`}>
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
  isMedium: false
};

export default ClientProfileProgress;
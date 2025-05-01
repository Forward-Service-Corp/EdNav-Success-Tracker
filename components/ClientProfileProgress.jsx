import React, { useEffect, useState } from 'react';
import { useClient } from '../contexts/ClientContext';
import ProgressButton from './ProgressButton';

function ClientProfileProgress({
  hasTrackable,
                                 setUpdated, isNarrow
                               }) {
  const { selectedClient } = useClient();
  const [completionPercentage, setCompletionPercentage] = useState(0);
// New state variables for better control
  const [savedItem] = useState([]); // Items saved in the database
  const [newSelections] = useState([]); // Items selected but not yet saved
  const [displayItems, setDisplayItems] = useState(selectedClient?.trackable?.items); // Combined items for display

  // // Initialize our state when hasTrackable changes
  useEffect(() => {
    if (Array.isArray(hasTrackable) && hasTrackable.length > 0) {
      // Initial setup of our state arrays
      // initializeStateArrays(selectedClient.trackable.items);

      // Calculate completion based on display items
      const percentage = calculateCompletionPercentage(displayItems);
      setCompletionPercentage(percentage);
      // console.log('Updated completion percentage:', percentage);
    } else {
      // setSavedItem([]);
      // setNewSelections([]);
      setDisplayItems([]);
      setCompletionPercentage(0);
    }
  }, [selectedClient]);

  // Initialize our state arrays from the incoming hasTrackable
  // const initializeStateArrays = (items) => {
  //   // Create arrays for saved items and new selections
  //   const saved = [];
  //   const newSelect = [];
  //   const display = [];
  //
  //   // Process each item
  //   items.forEach((item, index) => {
  //     // First check if item has an explicit savedInDatabase flag (from ActivityDynamicSelect)
  //     const isSavedInDB = item?.completed === true;
  //
  //     // Fallback to check hasTrackableCopy if no explicit flag (backward compatibility)
  //     // const isSavedInDBFallback = !isSavedInDB && Array.isArray(hasTrackableCopy) &&
  //     //   hasTrackableCopy[index] &&
  //     //   hasTrackableCopy[index].completed === true;
  //
  //     // Use either the explicit flag or the fallback
  //     const isItemSaved = isSavedInDB || false;
  //
  //     // Create an item with appropriate flags
  //     const processedItem = {
  //       ...item,
  //       savedInDatabase: isItemSaved,
  //       index: index // Store original index for reference
  //     };
  //
  //     // Add to appropriate arrays
  //     if (isItemSaved) {
  //       // This is a database-saved item
  //       saved.push(processedItem);
  //     } else if (item?.completed) {
  //       // This is selected but not yet saved
  //       newSelect.push(processedItem);
  //     }
  //
  //     // Always add to a display array
  //     display.push(processedItem);
  //   });
  //
  //   // Update state
  //   setSavedItem(saved);
  //   setNewSelections(newSelect);
  //   setDisplayItems(display);
  //
  //   // Check if this is a recently selected program
  //   checkIfRecentlySelected(display);
  // };

  // Check if the program was recently selected
  // const checkIfRecentlySelected = (items) => {
  //   if (!selectedClient?.trackable?.program) {
  //     // console.log('No program selected yet');
  //     return;
  //   }
  //
  //   // Check if there are any saved items - if none, it's a new selection
  //   // Explicitly check for the savedInDatabase flag from ActivityDynamicSelect
  //   const hasSavedItems = items.some(item => item.savedInDatabase === true);
  //   // console.log('Has saved items?', hasSavedItems);
  //
  //   if (!hasSavedItems) {
  //     // Also check localStorage as a backup for saved items
  //     let hasSavedItemsInStorage = false;
  //     if (typeof window !== 'undefined' && selectedClient?._id) {
  //       try {
  //         const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
  //         if (savedTrackable) {
  //           const parsedTrackable = JSON.parse(savedTrackable);
  //           if (parsedTrackable && Array.isArray(parsedTrackable.items)) {
  //             hasSavedItemsInStorage = parsedTrackable.items.some(item =>
  //               item && item.savedInDatabase === true
  //             );
  //             // console.log('Has saved items in localStorage?', hasSavedItemsInStorage);
  //           }
  //         }
  //       } catch (e) {
  //         console.error('Error checking localStorage for saved items:', e);
  //       }
  //     }
  //
  //     // If we still don't have saved items, check the timestamp
  //     if (!hasSavedItemsInStorage) {
  //       // Check timestamp if available
  //       // First try the client state
  //       let trackableTimestamp = selectedClient.trackable?.createdAt
  //         ? new Date(selectedClient.trackable.createdAt)
  //         : null;
  //
  //       // Then check localStorage as backup
  //       if (!trackableTimestamp && typeof window !== 'undefined' && selectedClient?._id) {
  //         try {
  //           const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
  //           if (savedTrackable) {
  //             const parsedTrackable = JSON.parse(savedTrackable);
  //             if (parsedTrackable && parsedTrackable.createdAt) {
  //               trackableTimestamp = new Date(parsedTrackable.createdAt);
  //             }
  //           }
  //         } catch (e) {
  //           console.error('Error checking localStorage for timestamp:', e);
  //         }
  //       }
  //
  //       if (trackableTimestamp) {
  //         const currentTime = new Date();
  //         const timeDiff = (currentTime - trackableTimestamp) / 1000; // in seconds
  //
  //         // Consider it recent if less than 5 minutes old
  //         const isRecentSelection = timeDiff < 300; // 5 minutes
  //         // console.log('Is recent selection based on timestamp?', isRecentSelection, 'Time diff:', timeDiff);
  //         setRecentlySelectedProgram(isRecentSelection);
  //       } else {
  //         // No timestamp, assume it's recent
  //         // console.log('No timestamp found, assuming recent selection');
  //         setRecentlySelectedProgram(true);
  //       }
  //     } else {
  //       // Has saved items in localStorage, not a recent selection
  //       setRecentlySelectedProgram(false);
  //     }
  //   } else {
  //     // Has saved items, not a recent selection
  //     setRecentlySelectedProgram(false);
  //   }
  // };

  // Update the display items whenever savedItems or newSelections change
  useEffect(() => {
    // Combine saved items and new selections into display items
    const combined = Array.isArray(hasTrackable) ? [...hasTrackable] : [];

    // Mark items as completed based on saved status and new selections
    combined.forEach((item, index) => {
      // Check if this item is saved in a database
      const isSavedInDB = savedItem.some(saved =>
        saved.index === index && saved.completed === true
      );

      // Check if this item is in new selections
      const isNewlySelected = newSelections.some(newItem =>
        newItem.index === index && newItem.completed === true
      );

      // Update the completion status
      combined[index] = {
        ...item,
        completed: isSavedInDB || isNewlySelected,
        savedInDatabase: isSavedInDB
      };
    });

    // Update display items
    setDisplayItems(selectedClient?.trackable?.items);

    // Also calculate completion percentage
    const percentage = calculateCompletionPercentage(selectedClient?.trackable?.items);
    setCompletionPercentage(percentage);

    // Mark as updated if there are new selections
    setUpdated(newSelections.length > 0);
  }, [savedItem, newSelections, hasTrackable]);


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
    (typeof window !== 'undefined' && selectedClient?._id && localStorage.getItem(`trackable-${selectedClient._id}`));


  // Function to safely render trackable items
  const renderTrackableItems = () => {
    if (!Array.isArray(displayItems)) {
      console.error('displayItems is not an array:', displayItems);
      return <div className="text-error">Error: Invalid trackable data</div>;
    }

    return displayItems.map((item, index) => {
      // Skip rendering if item is invalid
      // if (!item) {
      //   console.warn('Invalid item at index:', index);
      //   return null;
      // }

      return (
        <ProgressButton
          item={item}
          index={index}
          isDisabled={item?.completed}
          key={`item-${index}`} />
      );
    });
  };

  // Helper function to handle program reset
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
              <div className={`${isNarrow ? 'text-lg' : 'text-2xl'} flex items-center gap-2`}>
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

            {/*<div*/}
            {/*  onClick={handleTrackableUpdate}*/}
            {/*  className={`${updated || recentlySelectedProgram || newSelections.length > 0? 'btn btn-sm btn-secondary': 'hidden' }`}*/}
            {/*  data-testId="save-progress-button"*/}
            {/*>*/}
            {/*  {isUpdating ? 'Saving...' : 'Save Progress'}*/}
            {/*</div>*/}
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
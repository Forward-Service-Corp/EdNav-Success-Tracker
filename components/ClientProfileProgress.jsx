import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useClients } from '@/contexts/ClientsContext';

function ClientProfileProgress({
  hasTrackable,
  setHasTrackable,
  updated,
  setUpdated,
  hasTrackableCopy,
                                 isNarrow
                               }) {
  const { selectedClient, setSelectedClient } = useClients();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // New state variables for better control
  const [savedItems, setSavedItems] = useState([]); // Items saved in the database
  const [newSelections, setNewSelections] = useState([]); // Items selected but not yet saved
  const [displayItems, setDisplayItems] = useState([]); // Combined items for display
  const [recentlySelectedProgram, setRecentlySelectedProgram] = useState(false);

  // Initialize our state when hasTrackable changes
  useEffect(() => {
    if (Array.isArray(hasTrackable) && hasTrackable.length > 0) {
      // Initial setup of our state arrays
      initializeStateArrays(hasTrackable);

      // Calculate completion based on display items
      const percentage = calculateCompletionPercentage(displayItems);
      setCompletionPercentage(percentage);
      console.log('Updated completion percentage:', percentage);
    } else {
      setSavedItems([]);
      setNewSelections([]);
      setDisplayItems([]);
      setCompletionPercentage(0);
    }
  }, [hasTrackable]);

  // Initialize our state arrays from the incoming hasTrackable
  const initializeStateArrays = (items) => {
    // Create arrays for saved items and new selections
    const saved = [];
    const newSelect = [];
    const display = [];

    // Process each item
    items.forEach((item, index) => {
      // First check if item has explicit savedInDatabase flag (from ActivityDynamicSelect)
      const isSavedInDB = item.savedInDatabase === true;

      // Fallback to check hasTrackableCopy if no explicit flag (backward compatibility)
      const isSavedInDBFallback = !isSavedInDB && Array.isArray(hasTrackableCopy) &&
        hasTrackableCopy[index] &&
        hasTrackableCopy[index].completed === true;

      // Use either the explicit flag or the fallback
      const isItemSaved = isSavedInDB || isSavedInDBFallback;

      // Create item with appropriate flags
      const processedItem = {
        ...item,
        savedInDatabase: isItemSaved,
        index: index // Store original index for reference
      };

      // Add to appropriate arrays
      if (isItemSaved) {
        // This is a database-saved item
        saved.push(processedItem);
      } else if (item.completed) {
        // This is selected but not yet saved
        newSelect.push(processedItem);
      }

      // Always add to display array
      display.push(processedItem);
    });

    // Update state
    setSavedItems(saved);
    setNewSelections(newSelect);
    setDisplayItems(display);

    // Check if this is a recently selected program
    checkIfRecentlySelected(display);
  };

  // Check if the program was recently selected
  const checkIfRecentlySelected = (items) => {
    if (!selectedClient?.trackable?.program) {
      console.log('No program selected yet');
      return;
    }

    // Check if there are any saved items - if none, it's a new selection
    // Explicitly check for the savedInDatabase flag from ActivityDynamicSelect
    const hasSavedItems = items.some(item => item.savedInDatabase === true);
    console.log('Has saved items?', hasSavedItems);

    if (!hasSavedItems) {
      // Also check localStorage as a backup for saved items
      let hasSavedItemsInStorage = false;
      if (typeof window !== 'undefined' && selectedClient?._id) {
        try {
          const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
          if (savedTrackable) {
            const parsedTrackable = JSON.parse(savedTrackable);
            if (parsedTrackable && Array.isArray(parsedTrackable.items)) {
              hasSavedItemsInStorage = parsedTrackable.items.some(item =>
                item && item.savedInDatabase === true
              );
              console.log('Has saved items in localStorage?', hasSavedItemsInStorage);
            }
          }
        } catch (e) {
          console.error('Error checking localStorage for saved items:', e);
        }
      }

      // If we still don't have saved items, check timestamp
      if (!hasSavedItemsInStorage) {
        // Check timestamp if available
        // First try client state
        let trackableTimestamp = selectedClient.trackable?.createdAt
          ? new Date(selectedClient.trackable.createdAt)
          : null;

        // Then check localStorage as backup
        if (!trackableTimestamp && typeof window !== 'undefined' && selectedClient?._id) {
          try {
            const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
            if (savedTrackable) {
              const parsedTrackable = JSON.parse(savedTrackable);
              if (parsedTrackable && parsedTrackable.createdAt) {
                trackableTimestamp = new Date(parsedTrackable.createdAt);
              }
            }
          } catch (e) {
            console.error('Error checking localStorage for timestamp:', e);
          }
        }

        if (trackableTimestamp) {
          const currentTime = new Date();
          const timeDiff = (currentTime - trackableTimestamp) / 1000; // in seconds

          // Consider it recent if less than 5 minutes old
          const isRecentSelection = timeDiff < 300; // 5 minutes
          console.log('Is recent selection based on timestamp?', isRecentSelection, 'Time diff:', timeDiff);
          setRecentlySelectedProgram(isRecentSelection);
        } else {
          // No timestamp, assume it's recent
          console.log('No timestamp found, assuming recent selection');
          setRecentlySelectedProgram(true);
        }
      } else {
        // Has saved items in localStorage, not a recent selection
        setRecentlySelectedProgram(false);
      }
    } else {
      // Has saved items, not a recent selection
      setRecentlySelectedProgram(false);
    }
  };

  // Update the display items whenever savedItems or newSelections change
  useEffect(() => {
    // Combine saved items and new selections into display items
    const combined = Array.isArray(hasTrackable) ? [...hasTrackable] : [];

    // Mark items as completed based on saved status and new selections
    combined.forEach((item, index) => {
      // Check if this item is saved in database
      const isSavedInDB = savedItems.some(saved =>
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
    setDisplayItems(combined);

    // Also calculate completion percentage
    const percentage = calculateCompletionPercentage(combined);
    setCompletionPercentage(percentage);

    // Mark as updated if there are new selections
    setUpdated(newSelections.length > 0);
  }, [savedItems, newSelections, hasTrackable]);

  const handleTrackableUpdate = async () => {
    // Prevent multiple clicks
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      console.log('Updating trackable items:', displayItems);

      // Safety check
      if (!selectedClient || !selectedClient._id) {
        console.error('No client selected');
        setIsUpdating(false);
        return;
      }

      // Show a confirmation dialog if this is a recently selected program
      if (recentlySelectedProgram) {
        const confirmSave = window.confirm(
          `This will permanently save your ${selectedClient.trackable?.program} program selection. Continue?`
        );

        if (!confirmSave) {
          setIsUpdating(false);
          return;
        }
      }

      // Check if all items are completed for graduation
      const validTrackable = Array.isArray(displayItems) ? displayItems : [];
      const completed = validTrackable.filter(item => item && item.completed === true);
      const graduated = completed.length === validTrackable.length && validTrackable.length > 0;

      // Preserve the program value (GED or HSED)
      const program = selectedClient.trackable?.program || 'GED'; // Default to GED if not set

      // Create new client object with updated trackable items
      const updatedClient = {
        ...selectedClient,
        trackable: {
          ...selectedClient.trackable,
          program: program, // Ensure program value is preserved
          items: validTrackable,
          programComplete: graduated
        }
      };

      console.log('Sending trackable update with program:', program);

      // Update client in context for UI updates
      setSelectedClient(updatedClient);

      // Save in localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          // Store the current time as the creation time if not already set
          if (!updatedClient.trackable.createdAt) {
            updatedClient.trackable.createdAt = new Date().toISOString();
          }
          
          localStorage.setItem(`trackable-${selectedClient._id}`,
            JSON.stringify(updatedClient.trackable)
          );
        } catch (e) {
          console.error('Failed to save trackable to localStorage', e);
        }
      }

      console.log('Sending trackable update to API:', updatedClient);

      // Send update to the API
      const res = await fetch(`/api/trackable?clientId=${selectedClient._id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedClient),
        method: 'POST'
      });

      const data = await res.json();
      if (data.error) {
        console.error('API error:', data.error);
      } else {
        console.log('Trackable update successful:', data);

        // Update state to reflect that everything is now saved
        if (data.trackable && data.trackable.items) {
          // Add savedInDatabase flag to all completed items
          const itemsWithSavedFlag = data.trackable.items.map(item => ({
            ...item,
            savedInDatabase: item.completed // Only completed items are saved
          }));

          // Update all our state arrays
          setSavedItems(itemsWithSavedFlag.filter(item => item.completed));
          setNewSelections([]); // Clear the new selections since they're now saved
          setDisplayItems(itemsWithSavedFlag);

          // Update the parent state too
          setHasTrackable(itemsWithSavedFlag);
          setHasTrackableCopy(JSON.parse(JSON.stringify(itemsWithSavedFlag)));

          // This is no longer a recently selected program
          setRecentlySelectedProgram(false);
        }
      }

      // Update was successful
      setUpdated(false);
    } catch (error) {
      console.error('Error updating trackable:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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

  useEffect(() => {
    // Check localStorage for trackable data when component mounts or client changes
    if (typeof window !== 'undefined' && selectedClient?._id) {
      try {
        const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
        if (savedTrackable) {
          const parsedTrackable = JSON.parse(savedTrackable);
          if (parsedTrackable && parsedTrackable.program &&
            (parsedTrackable.program === 'GED' || parsedTrackable.program === 'HSED')) {

            // Get timestamps to check if this was a recent selection
            const trackableTimestamp = parsedTrackable.createdAt ? new Date(parsedTrackable.createdAt) : null;
            const currentTime = new Date();
            const timeDiff = trackableTimestamp ? (currentTime - trackableTimestamp) / 1000 : Infinity; // in seconds

            // Consider it a recent selection if it was made in the last 5 minutes
            // AND if there are no items saved to the database yet
            const hasSavedItems = parsedTrackable.items &&
              Array.isArray(parsedTrackable.items) &&
              parsedTrackable.items.some(item => item && item.savedInDatabase === true);

            const isRecentSelection = timeDiff < 300 && !hasSavedItems; // 5 minutes in seconds
            setRecentlySelectedProgram(isRecentSelection);

            // If we have valid trackable data with GED/HSED in localStorage but not in the client,
            // update the client to include this data
            if (selectedClient?.trackable?.program !== 'GED' && selectedClient?.trackable?.program !== 'HSED') {
              console.log('Restoring saved trackable program data from localStorage');
              setTimeout(() => {
                const updatedClient = {
                  ...selectedClient,
                  trackable: {
                    ...(selectedClient?.trackable || {}),
                    program: parsedTrackable.program,
                    items: parsedTrackable.items || [],
                    createdAt: parsedTrackable.createdAt || new Date().toISOString()
                  }
                };
                setSelectedClient(updatedClient);
              }, 0);
            }
          }
        }
      } catch (e) {
        console.error('Error checking localStorage for trackable data:', e);
      }

      // Set up listener for trackableUpdated events from ActivityDynamicSelect
      const handleTrackableUpdate = (event) => {
        if (event.detail && event.detail.trackable && event.detail.clientId === selectedClient._id) {
          console.log('ClientProfileProgress received trackableUpdated event:', event.detail);

          // Get the trackable data from the event
          const trackableData = event.detail.trackable;

          // Update our hasTrackable state with the new data
          if (trackableData.items && Array.isArray(trackableData.items)) {
            setHasTrackable(trackableData.items);

            // Initialize state arrays with the new data
            initializeStateArrays(trackableData.items);
          }
        }
      };

      // Add event listener
      window.addEventListener('trackableUpdated', handleTrackableUpdate);

      // Remove it on cleanup
      return () => {
        window.removeEventListener('trackableUpdated', handleTrackableUpdate);
      };
    }
  }, [selectedClient, setSelectedClient]);

  const handleItemClick = (index) => {
    // Safety check for displayItems array
    if (!Array.isArray(displayItems) || !displayItems[index]) {
      console.error('Invalid displayItems at index:', index);
      return;
    }

    // Get the current item
    const currentItem = displayItems[index];

    // If item is already saved in database, don't allow changes
    if (currentItem.savedInDatabase) {
      console.log('Item is saved in database, cannot change:', currentItem);
      return;
    }

    try {
      // Toggle completion state
      const newCompletionState = !currentItem.completed;

      if (newCompletionState) {
        // Item is being selected - add to newSelections if not already there
        setNewSelections(prev => {
          const itemExists = prev.some(item => item.index === index);

          if (itemExists) {
            // Update the existing item
            return prev.map(item =>
              item.index === index ? { ...item, completed: true } : item
            );
          } else {
            // Add the new item
            return [...prev, { ...currentItem, completed: true, index }];
          }
        });
      } else {
        // Item is being unselected - remove from newSelections
        setNewSelections(prev => prev.filter(item => item.index !== index));
      }

      // Update the display item directly for immediate UI feedback
      setDisplayItems(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], completed: newCompletionState };
        return updated;
      });

      // Mark as needing to be saved
      setUpdated(true);

    } catch (error) {
      console.error('Error in handleItemClick:', error);
    }
  };

  // Function to safely render trackable items
  const renderTrackableItems = () => {
    if (!Array.isArray(displayItems)) {
      console.error('displayItems is not an array:', displayItems);
      return <div className="text-error">Error: Invalid trackable data</div>;
    }

    return displayItems.map((item, index) => {
      // Skip rendering if item is invalid
      if (!item) {
        console.warn('Invalid item at index:', index);
        return null;
      }

      // Determine if the item is saved to the database
      const isDatabaseCompleted = item.savedInDatabase === true;

      // Item is disabled only if it's already saved to the database
      const isDisabled = isDatabaseCompleted;

      // Determine status for visual styling
      const isUnsavedSelection = item.completed && !isDatabaseCompleted;

      return (
        <button
          key={index}
          data-testid={`trackable-item-${index}`}
          disabled={isDisabled}
          className={`cursor-pointer text-nowrap ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={() => handleItemClick(index)}
          title={isDatabaseCompleted
            ? 'This item is already saved in the database and cannot be changed'
            : isUnsavedSelection
              ? 'Selected but not yet saved to database'
              : ''}
        >
          {item.completed === true ? (
            <span
              className={`${isDatabaseCompleted ? 'border-success' : 'border-warning'} flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <CheckCircleIcon className={`${isDatabaseCompleted ? 'text-success' : 'text-warning'} h-6 w-6`} />
              </span>
              {item.name}
              {!isDatabaseCompleted && (
                <span className="ml-1 text-[10px] text-warning">(not saved)</span>
              )}
            </span>
          ) : (
            <span className={`border-base-content/40 flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <span className={`text-base-content/40 m-[2px] block h-5 w-5 rounded-full border`} />
              </span>
              {item.name}
            </span>
          )}
        </button>
      );
    });
  };

  // Helper function to handle program reset
  const handleProgramReset = () => {
    if (window.confirm(`Are you sure you want to undo your ${selectedClient?.trackable?.program} program selection?`)) {
      // Create an updated client without the trackable program
      const updatedClient = {
        ...selectedClient,
        trackable: undefined
      };

      // Update client state - keep the client selected, just remove trackable
      setSelectedClient(updatedClient);

      // Also clear localStorage
      if (typeof window !== 'undefined' && selectedClient?._id) {
        localStorage.removeItem(`trackable-${selectedClient._id}`);
      }

      // Reset states
      setSavedItems([]);
      setNewSelections([]);
      setDisplayItems([]);
      setHasTrackable([]);
      setHasTrackableCopy([]);
      setRecentlySelectedProgram(false);
      setCompletionPercentage(0);
    }
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
        className={`card bg-base-200 border-base-content/10 relative mx-3 md:mx-6 rounded border-1 shadow-sm ${isProgressVisible ? '' : 'opacity-50 blur-[2px]'}`}
        data-testid="progress-area"
      >
        <div className="card-body">
          <div className={`mt-0 mb-4 flex items-center justify-between`}>
            <div>
              <div className={`${isNarrow ? 'text-lg' : 'text-2xl'} flex items-center gap-2`}>
                {selectedClient?.trackable?.program || 'Program'} Progress -{' '}
                {completionPercentage}%

                {/* Show the undo button if the program was recently selected */}
                {recentlySelectedProgram && (
                  <button
                    onClick={handleProgramReset}
                    className="btn btn-xs btn-error btn-outline"
                    title="Undo program selection"
                  >
                    Undo
                  </button>
                )}
              </div>
              <p className={`text-info text-sm`}>
                Click items to mark them as completed, then click Save Progress.
              </p>
              <p className={`text-xs opacity-70 mt-1`}>
                <span className="font-medium">Note:</span> Items saved to the database cannot be unchecked.
              </p>
            </div>

            <div
              onClick={handleTrackableUpdate}
              className={`${updated || recentlySelectedProgram || newSelections.length > 0 ? 'btn btn-sm btn-secondary' : 'hidden'}`}
              data-testid="save-progress-button"
            >
              {isUpdating ? 'Saving...' : 'Save Progress'}
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
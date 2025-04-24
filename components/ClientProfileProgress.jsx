import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useClients } from '../contexts/ClientsContext';

function ClientProfileProgress({
  hasTrackable,
  setHasTrackable,
  updated,
  setUpdated,
  hasTrackableCopy,
}) {
  const { selectedClient, setSelectedClient } = useClients();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate and update the completion percentage whenever hasTrackable changes
  useEffect(() => {
    if (Array.isArray(hasTrackable) && hasTrackable.length > 0) {
      const percentage = calculateCompletionPercentage(hasTrackable);
      setCompletionPercentage(percentage);
      console.log('Updated completion percentage:', percentage);
    } else {
      setCompletionPercentage(0);
    }
  }, [hasTrackable]);

  const handleTrackableUpdate = async () => {
    // Prevent multiple clicks
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      console.log('Updating trackable items:', hasTrackable);

      // Safety check
      if (!selectedClient || !selectedClient._id) {
        console.error('No client selected');
        setIsUpdating(false);
        return;
      }

      // Check if all items are completed for graduation
      const validTrackable = Array.isArray(hasTrackable) ? hasTrackable : [];
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

        // Update local state to reflect database changes AND set the copy to disable completed items
        if (data.trackable && data.trackable.items) {
          // Update the items array
          setHasTrackable(data.trackable.items);

          // Update the copy to mark saved items as completed in database
          setHasTrackableCopy(JSON.parse(JSON.stringify(data.trackable.items)));
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
  const isProgessVisible = selectedClient?.trackable?.program === 'GED' ||
    selectedClient?.trackable?.program === 'HSED';

  const handleItemClick = (index) => {
    // Safety check for hasTrackable array
    if (!Array.isArray(hasTrackable) || !hasTrackable[index]) {
      console.error('Invalid trackable item at index:', index);
      return;
    }

    try {
      // Get current completion state
      const hasTrackableState = !hasTrackable[index].completed;

      // Update local state first
      setHasTrackable((prevState) => {
        // Safety check
        if (!Array.isArray(prevState) || !prevState[index]) {
          console.error('Invalid previous state at index:', index);
          return prevState;
        }

        const newItems = [...prevState];
        newItems[index] = { ...newItems[index], completed: hasTrackableState };
        setUpdated(true); // Mark as needing to be saved
        return newItems;
      });

      // Update client trackable data
      if (selectedClient && selectedClient.trackable && Array.isArray(selectedClient.trackable.items)) {
        setTimeout(() => {
          try {
            // Safety check for index
            if (index >= selectedClient.trackable.items.length) {
              console.error('Index out of bounds for client trackable items');
              return;
            }

            const updatedItems = [...selectedClient.trackable.items];

            // Make sure the item exists before updating it
            if (updatedItems[index]) {
              updatedItems[index] = { ...updatedItems[index], completed: hasTrackableState };

              const updatedClient = {
                ...selectedClient,
                trackable: {
                  ...selectedClient.trackable,
                  items: updatedItems
                }
              };

              setSelectedClient(updatedClient);
            } else {
              console.error('Item not found at index:', index);
            }
          } catch (error) {
            console.error('Error updating client trackable item:', error);
          }
        }, 0);
      } else {
        console.warn('Client has no trackable items to update');
      }
    } catch (error) {
      console.error('Error in handleItemClick:', error);
    }
  };

  // Function to safely render trackable items
  const renderTrackableItems = () => {
    if (!Array.isArray(hasTrackable)) {
      console.error('hasTrackable is not an array:', hasTrackable);
      return <div className="text-error">Error: Invalid trackable data</div>;
    }

    return hasTrackable.map((item, index) => {
      // Skip rendering if item is invalid
      if (!item) {
        console.warn('Invalid item at index:', index);
        return null;
      }

      // Determine if the item should be disabled based on database state
      // If the item is completed in the original copy from the database, it should be disabled
      const isDatabaseCompleted = Array.isArray(hasTrackableCopy) &&
        hasTrackableCopy[index] &&
        hasTrackableCopy[index].completed === true;

      // Item is either disabled by database state or currently selected
      const isDisabled = isDatabaseCompleted;

      return (
        <button
          key={index}
          data-testid={`trackable-item-${index}`}
          disabled={isDisabled}
          className={`cursor-pointer text-nowrap ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={() => handleItemClick(index)}
          title={isDatabaseCompleted ? 'This item is already saved in the database and cannot be changed' : ''}
        >
          {item.completed === true ? (
            <span className={`border-success flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <CheckCircleIcon className={`text-success h-6 w-6`} />
              </span>
              {item.name}
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
  
  return (
    <div className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${isProgessVisible ? 'invisible' : 'visible'}`}
      >
        <div
          className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded p-6 text-center shadow`}
        >
          Add an activity regarding GED or HSED to activate this area.
        </div>
      </div>
      <div
        className={`card bg-base-200 border-base-content/10 relative mx-6 rounded border-1 shadow-sm ${isProgessVisible ? '' : 'opacity-50 blur-[2px]'}`}
        data-testid="progress-area"
      >
        <div className="card-body">
          <div className={`mt-0 mb-4 flex items-center justify-between`}>
            <div>
              <div className={`text-2xl`}>
                {selectedClient?.trackable?.program || 'Program'} Progress -{' '}
                {completionPercentage}%
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
              className={`${updated ? 'btn btn-sm btn-secondary' : 'hidden'}`}
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

export default ClientProfileProgress;
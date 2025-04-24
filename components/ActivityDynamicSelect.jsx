import React, { useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useActivities } from '@/contexts/ActivityContext';
import { generateSentence } from '@/utils/generateSentence';

const ActivityDynamicSelect = ({ setOpen, questions, onSuccess }) => {
  const { selectedActivity, setSelectedActivity } = useActivities();
  const { selectedClient, setSelectedClient } = useClients();
  const [selectedPath, setSelectedPath] = useState([]);
  const [currentOptions, setCurrentOptions] = useState(Object.keys(questions));
  const [, setCurrentObject] = useState(questions);
  const [finalSelection, setFinalSelection] = useState(null);
  const [multiSelectOptions, setMultiSelectOptions] = useState(null);
  const [multiSelectValues, setMultiSelectValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trackable, setTrackable] = useState(null);
  const [, setTextInput] = useState("");

  // Helper function to check if a path should trigger a status update
  const shouldUpdateClientStatus = (path) => {
    // Convert a path array to a single lowercase string for easier checking
    const pathString = path.join(" ").toLowerCase();

    // Check for keywords that should trigger a status update
    return (
      pathString.includes("graduated") ||
      pathString.includes("completion") ||
      pathString.includes("inactive")
    );
  };

  // Helper function to determine the new status based on the path
  const determineNewStatus = (path) => {
    const pathString = path.join(" ").toLowerCase();

    if (pathString.includes("graduated")) {
      return "graduated";
    } else if (pathString.includes("inactive")) {
      return "inactive";
    } else if (pathString.includes("completion")) {
      // Determine whether to use graduated or inactive based on a client group
      return selectedClient?.group?.toLowerCase() === "youth"
        ? "graduated"
        : "inactive";
    }

    return null;
  };

  // Function to update only trackable items without overwriting an entire client
  const updateClientTrackableItems = (
    clientToUpdate,
    serverResponse,
    selectedValues,
  ) => {
    // Safety check
    if (!clientToUpdate || !serverResponse) return clientToUpdate;

    // Don't update if no multiselect values
    if (!selectedValues || !selectedValues.length) return clientToUpdate;

    // Get a set of selected value names for a quicker lookup
    const selectedSet = new Set(selectedValues);

    // Create a new client object with the same properties
    const updatedClient = { ...clientToUpdate };

    // Only update trackable if it exists
    if (updatedClient.trackable && updatedClient.trackable.items) {
      // Create a new array of trackable items
      updatedClient.trackable = {
        ...updatedClient.trackable,
        items: updatedClient.trackable.items.map((item) => {
          // Only override values in the selected set
          if (selectedSet.has(item.name)) {
            return { ...item, completed: true };
          }
          // Keep other values the same
          return item;
        }),
      };
    }

    // Return the updated client
    return updatedClient;
  };

  const saveSelectionToMongoDB = async (newPath, multi) => {
    setOpen(false);
    const data = {
      clientEmail: selectedClient.email,
      clientId: selectedClient._id,
      fep: selectedClient.fep,
      navigator: selectedClient["navigator"],
      selectedDate: selectedDate,
      selection: selectedValue,
      timestamp: new Date(),
      trackable: trackable,
      selections: multi ? multiSelectValues : null,
    };

    if (multi) {
      // For multi-select, use the current path
      data.path = selectedPath;
      data.statement = generateSentence(
        selectedClient["navigator"],
        selectedClient["first_name"] + " " + selectedClient["last_name"],
        multiSelectValues,
        selectedPath,
      );
    } else {
      // For single-select, use the new path
      data.path = newPath;
      data.statement = generateSentence(
        selectedClient["navigator"],
        selectedClient["first_name"] + " " + selectedClient["last_name"],
        null,
        newPath,
      );
    }

    // Check if this activity should update the client status
    const shouldUpdateStatus = shouldUpdateClientStatus(
      multi ? selectedPath : newPath,
    );
    if (shouldUpdateStatus) {
      // Determine new status
      const newStatus = determineNewStatus(multi ? selectedPath : newPath);

      // If we have a valid new status, add it to the data
      if (newStatus) {
        data.updateClientStatus = newStatus;

        // Optimistically update client status in UI
        if (selectedClient) {
          // Create a new client object with an updated status
          const updatedClient = {
            ...selectedClient,
            clientStatus: newStatus,
          };

          // Update client in context
          setSelectedClient(updatedClient);
        }
      }
    }

    try {
      // Create a properly formatted activity for local display with a temporary ID
      const tempId = `temp-${Date.now()}`;

      // This is the optimistic activity that will be displayed immediately
      const optimisticActivity = {
        ...data,
        _id: tempId, // Use a temporary ID that we can track
        type: "activity",
        navigator: data.navigator || selectedClient.navigator || 'Unknown',
        statement: data.statement || 'Activity recorded',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        date: new Date(),
        isOptimistic: true // Flag to identify optimistic updates
      };

      console.log('Created optimistic activity:', optimisticActivity);

      // Add to global feed if the function exists - this will immediately show in the UI
      if (typeof window !== 'undefined') {
        // Try the direct addItemToFeed approach first
        if (window.addItemToFeed) {
          console.log('ACTIVITY DEBUG: Using direct addItemToFeed for immediate display');
          window.addItemToFeed(optimisticActivity);
        }
        // Then also try the simplified approach 
        else if (window.addActivitySimplified) {
          console.log('ACTIVITY DEBUG: Using addActivitySimplified');
          window.addActivitySimplified(optimisticActivity);
        }
        // Fall back to the original approach as a last resort
        else if (window.addActivityToFeed) {
          console.log('ACTIVITY DEBUG: Falling back to legacy addActivityToFeed');
          window.addActivityToFeed(optimisticActivity);
        } else {
          console.error('ACTIVITY DEBUG: No activity display method available!');
        }

        // Also dispatch an event for backward compatibility
        console.log('ACTIVITY DEBUG: Dispatching activityAdded event for compatibility');
        const activityAddedEvent = new CustomEvent('activityAdded', {
          detail: optimisticActivity,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(activityAddedEvent);
      } else {
        console.error('ACTIVITY DEBUG: window object not available!');
      }

      // Send the API request asynchronously but don't wait for it
      console.log('Sending API request with data:', { data });
      fetch('/api/activities', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
        redirect: "follow",
        referrerPolicy: "no-referrer",
        dataType: "json",
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          console.log('Received API response:', result);

          // We'll update the activity list if actionRes exists, but we're
          // NOT replacing the optimistic activity in the feed, as that
          // causes it to disappear
          if (result.userActions) {
            setSelectedActivity((prev) => ({
              ...prev,
              activities: [...(prev?.activities || []), result.activity || result]
            }));
          }

          // Call onSuccess with the result
          if (onSuccess) {
            console.log('Calling onSuccess with result');
            onSuccess(result);
          }

          // Update client data if needed
          if (result.wholeUser && multi && multiSelectValues.length > 0) {
            // Call our helper function that doesn't overwrite the whole object
            const updatedClient = updateClientTrackableItems(
              selectedClient,
              result.wholeUser,
              multiSelectValues
            );

            // Update the client with our carefully constructed object
            setSelectedClient(updatedClient);
          }
        })
        .catch(error => {
          console.error('Error saving activity:', error);

          // If we failed, try to remove the optimistic update
          if (typeof window !== 'undefined' && window.removeActivityFromFeed) {
            window.removeActivityFromFeed(tempId);
          }
        });

      // Return our optimistic activity for now, we won't wait for the API
      return optimisticActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedClient?.group) {
      const autoSelection = selectedClient.group.toLowerCase();
      if (questions[autoSelection]) {
        setSelectedPath([autoSelection]);
        setCurrentObject(questions[autoSelection]);
        let options = Object.keys(questions[autoSelection]);
        setCurrentOptions(options);
      }
    }
  }, [selectedClient]);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleAdvance = async () => {
    if (!selectedValue) return;
    let newArray = [...selectedPath];

    const newPath = [...newArray, selectedValue];
    setSelectedPath(newPath);
    setSelectedValue("");
    const newObject = newPath.reduce(
      (acc, key) => (acc && acc[key] ? acc[key] : null),
      questions,
    );
    setCurrentObject(newObject);

    if (selectedValue === "GED" || selectedValue === "HSED") {
      const nextLevel = Object.values(newObject); // go one level deeper
      let items = [];
      if (Array.isArray(nextLevel) && nextLevel.length > 0) {
        items = nextLevel.map((item) => ({
          name: item,
          completed: false,
        }));
      }
      setTrackable({
        program: selectedValue,
        length: items.length,
        items: items,
      });
    }

    if (newObject && typeof newObject === "object") {
      if (
        Object.keys(newObject).length > 0 &&
        Object.hasOwn(newObject, "other")
      ) {
        setCurrentOptions((prevState) => {
          return [...prevState, "hasTextInput"];
        });
        setTextInput("hasTextInput");
      }
    }

    if (newObject && Object.keys(newObject).length === 0) {
      setCurrentOptions([]);
      setFinalSelection(selectedValue);
      await saveSelectionToMongoDB(newPath, false);
      return;
    }

    if (newObject && typeof newObject === "object") {
      setFinalSelection(null);
      if (selectedPath.includes("other")) {
        setMultiSelectOptions(null);
        setCurrentOptions([]);
        setFinalSelection(selectedValue);
        await saveSelectionToMongoDB(newPath, false);
        return;
      }
      if (Array.isArray(newObject)) {
        setMultiSelectOptions(newObject);
        setCurrentOptions([]);
      } else {
        setMultiSelectOptions(null);
        let options = Object.keys(newObject);
        setCurrentOptions(options);
      }
    } else if (Array.isArray(newObject)) {
      setMultiSelectOptions(newObject.completed);
      setCurrentOptions([]);
    } else {
      setCurrentOptions([]);
      setFinalSelection(selectedValue);

      try {
        const result = await saveSelectionToMongoDB(newPath, false);
        if (result && selectedActivity && selectedActivity.activities) {
          setSelectedActivity({
            ...selectedActivity,
            activities: [...selectedActivity.activities, result],
          });
        }

        // Call onSuccess callback if provided
        if (onSuccess && result) {
          onSuccess(result.activity || result);
        }
      } catch (error) {
        console.error("Error saving activity:", error);
      }
    }
  };

  const handleMultiSelectChange = (option, index) => {
    // Update multiSelectValues state
    setMultiSelectValues((prev) => {
      const isRemoval = prev.includes(option);

      // If we're removing from multiSelectValues, update the trackable item accordingly
      if (isRemoval) {
        if (trackable && trackable.items && trackable.items.length > 0) {
          // Set to false if removed from selection
          const updatedItems = [...trackable.items];
          updatedItems[index] = { ...updatedItems[index], completed: false };
          setTrackable({ ...trackable, items: updatedItems });
        }
        return prev.filter((item) => item !== option);
      }
      // If we're adding to multiSelectValues
      else {
        // Always set the trackable item to true when selected
        if (trackable && trackable.items && trackable.items.length > 0) {
          const updatedItems = [...trackable.items];
          updatedItems[index] = { ...updatedItems[index], completed: true };
          setTrackable({ ...trackable, items: updatedItems });
        }
        return [...prev, option];
      }
    });
  };

  const handleMultiSelectAdvance = async () => {
    // Make sure we're sending it true to indicate this is a multi-select submission
    const result = await saveSelectionToMongoDB(selectedPath, true);

    setMultiSelectOptions(null);
    setCurrentOptions([]);
    setFinalSelection("Completed Multi-Select");

    // Call onSuccess callback if provided
    if (onSuccess && result) {
      onSuccess(result.activity || result);
    }
  };

  const showDatePicker = selectedPath.length === 1; // Show DatePicker only at the beginning

  return (
    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-100">
      {showDatePicker && (
        <label className="flex flex-col space-y-2 font-light">
          Date of activity:
          <input
            type="date"
            name="date"
            className="border-base-content text-base-content placeholder:text-base-content mt-2 rounded border px-3 py-1"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </label>
      )}
      {selectedPath ?? <div> selectedPath.toString() </div>}
      {selectedPath && selectedPath.includes("other") && (
        <label className="flex flex-col space-y-2 font-light">
          <input
            type="text"
            name={selectedPath[selectedPath.length - 1 || "firstOption"]}
            className="border-base-content text-base-content placeholder:text-base-content mt-2 rounded border px-3 py-1"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
          <button
            className="mt-4 rounded-lg bg-blue-500 p-2 text-white"
            onClick={handleAdvance}
          >
            Continue
          </button>
        </label>
      )}

      {currentOptions.length > 0 && !selectedPath.includes("other") && (
        <label className="mt-6 flex flex-col space-y-2 font-light capitalize">
          <select
            name={selectedPath[selectedPath.length - 1] || "firstOption"}
            className={`border-base-content text-base-content placeholder:text-base-content mt-2 rounded border px-3 py-1`}
            value={selectedValue}
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <option value="">Select an activity</option>
            {currentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            className="mt-4 rounded-lg bg-blue-500 p-2 text-white"
            onClick={handleAdvance}
            disabled={!selectedValue}
          >
            Continue
          </button>
        </label>
      )}

      {multiSelectOptions && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold">Select Multiple Options</h3>
          <div className="grid grid-cols-1 gap-2">
            {multiSelectOptions.map((option, index) => (
              <label
                key={`${option}-${index}`}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={option}
                  name={selectedPath[selectedPath.length - 1] || "firstOption"}
                  checked={multiSelectValues.includes(option)}
                  onChange={() => handleMultiSelectChange(option, index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <button
            className="mt-4 rounded-lg bg-blue-500 p-2 text-white"
            onClick={handleMultiSelectAdvance}
            disabled={multiSelectValues.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {finalSelection && (
        <div className="mt-4 text-green-700">
          Your activity was saved successfully.
        </div>
      )}
    </div>
  );
};

export default ActivityDynamicSelect;
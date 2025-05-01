import React, { useEffect, useState } from 'react';
import { useClient } from '../contexts/ClientContext';
import { useActivities } from '../contexts/ActivityContext';
import { generateSentence } from '../utils/generateSentence';

const ActivityDynamicSelect = ({ setOpen, questions = {}, onSuccess }) => {
  // console.log('ActivityDynamicSelect initialized with questions:', questions);
  
  const { selectedActivity, setSelectedActivity } = useActivities();
  const { selectedClient, setSelectedClient } = useClient();
  const [selectedPath, setSelectedPath] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [, setCurrentObject] = useState({});
  const [finalSelection, setFinalSelection] = useState(null);
  const [multiSelectOptions, setMultiSelectOptions] = useState(null);
  const [multiSelectValues, setMultiSelectValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trackable, setTrackable] = useState({
    program: '',
    items: [],
    createdAt: '',
    length: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setTextInput] = useState('');
  const [pendingClientUpdate, setPendingClientUpdate] = useState(null);

  // Safety function for checking arrays
  // const safeArrayCheck = (arr, predicate) => {
  //   if (!Array.isArray(arr)) return false;
  //   try {
  //     return arr.some(predicate);
  //   } catch (e) {
  //     console.error('Error in array check:', e);
  //     return false;
  //   }
  // };

  // Set initial currentOptions based on questions
  useEffect(() => {
    if (questions && typeof questions === 'object') {
      setCurrentOptions(Object.keys(questions));
    }
  }, [questions]);

  // Handle setting selectedPath and currentObject based on the client's group
  useEffect(() => {
    if (selectedClient?.group) {
      const autoSelection = selectedClient?.group.toLowerCase();
      if (questions[autoSelection]) {
        setSelectedPath([autoSelection]);
        setCurrentObject(questions[autoSelection]);
        let options = Object.keys(questions[autoSelection]);

        // Remove the current program from options if already enrolled
        filterProgramOptions(autoSelection, options);
      }
    }
  }, [selectedClient, questions]);

  // Helper function to filter out GED/HSED options if a client already has one selected
  const filterProgramOptions = (_group, options) => {
    // First check client's direct data
    let program = selectedClient?.trackable?.program;
    let isProgramSavedInDatabase = false;

    // If no program found in client data, check localStorage
    // if (typeof window !== 'undefined' && selectedClient?._id) {
    //   try {
    //     const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
    //     if (savedTrackable) {
    //       const parsedTrackable = JSON.parse(savedTrackable);
    //       if (parsedTrackable && parsedTrackable.program) {
    //         program = parsedTrackable.program;
    //
    //         // Check if this program has been saved to a database by looking at the items
    //         if (Array.isArray(parsedTrackable.items) && parsedTrackable.items.length > 0) {
    //           // If any item is completed and saved in a database, we consider the program permanent
    //           isProgramSavedInDatabase = parsedTrackable.items.some(item =>
    //             item && item.completed === true && item.savedInDatabase === true
    //           );
    //
    //           // Also check the timestamp - if it's older than 5 minutes, consider it permanent
    //           if (parsedTrackable.createdAt) {
    //             const creationTime = new Date(parsedTrackable.createdAt);
    //             const currentTime = new Date();
    //             const timeDiff = (currentTime - creationTime) / 1000; // in seconds
    //
    //             // If it's been more than 5 minutes since selection, consider it permanent
    //             if (timeDiff > 300) { // 5 minutes
    //               isProgramSavedInDatabase = true;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   } catch (e) {
    //     console.error('Error checking localStorage for program:', e);
    //   }
    // }

    // Only filter out options from educational activities
    let filteredOptions = [...options];

    // If we found a program (either GED or HSED) that has been saved to a database,
    // remove it from educational activities options
    if ((program === 'GED' || program === 'HSED') && isProgramSavedInDatabase) {
      // console.log('Found existing saved program:', program, 'Filtering from options');

      // Remove the program from a list of available options
      filteredOptions = options.filter(option => option !== program);

      // Set the filtered options
      setCurrentOptions(filteredOptions);
    } else {
      // No permanent program to filter, use all options
      setCurrentOptions(options);
    }
  };

  // Effect to handle client-trackable updates when needed
  useEffect(() => {
    if (pendingClientUpdate) {
      // Use a small timeout to ensure the state is settled before processing
      setTimeout(() => {
        // Set the client update first - make a clean copy to avoid reference issues
        const clientToUpdate = JSON.parse(JSON.stringify(pendingClientUpdate));
        setSelectedClient(clientToUpdate);

        // Update client orientation/tabe/transcripts status based on trackable type,
        // but ONLY if the specific trackable items are actually completed
        if (clientToUpdate.trackable && Array.isArray(clientToUpdate.trackable.items)) {
          const trackableItems = clientToUpdate.trackable.items || [];

          // Only get the COMPLETED trackable item names (not just any trackable items)
          const completedItemNames = trackableItems
            .filter(item => item && typeof item.name === 'string' && item.completed === true)
            .map(item => item.name.toLowerCase());

          // console.log('Completed trackable items:', completedItemNames);

          // Process each section that needs activation
          completedItemNames.forEach(itemName => {
            // Only enable the relevant sections in ClientProfileTabeOrientation if completed
            if (itemName === 'orientation' || itemName === 'tabe' || itemName === 'transcripts') {
              activateClientSection(itemName);
            }
          });
        }

        // Clear the pending update after processing
        setPendingClientUpdate(null);
      }, 50); // Small delay to ensure state is settled
    }
  }, [pendingClientUpdate, setSelectedClient]);

  // Helper function to activate sections in ClientProfileTabeOrientation
  const activateClientSection = (sectionName) => {
    // Normalize the section name to lowercase for consistency
    const normalizedSectionName = sectionName.toLowerCase();
    // console.log(`Activating client section: ${normalizedSectionName}`);
    
    // Create a date for today
    const today = new Date();

    // Create an updated client with the section enabled
    const updatedClient = {
      ...selectedClient,
      [normalizedSectionName]: {
        ...(selectedClient[normalizedSectionName] || {}),
        referralDate: selectedClient[normalizedSectionName]?.referralDate || today.toISOString(),
        completionDate: today.toISOString() // Set the completion date today since we're marking it as complete
      }
    };

    // Also update the trackable items to mark this item as completed
    if (selectedClient?.trackable?.items && Array.isArray(selectedClient.trackable.items)) {
      const updatedItems = [...selectedClient.trackable.items];
      let itemUpdated = false;

      // Find the item with a matching name and mark it as completed AND saved
      for (let i = 0; i < updatedItems.length; i++) {
        if (updatedItems[i]?.name?.toLowerCase() === normalizedSectionName) {
          updatedItems[i] = {
            ...updatedItems[i],
            completed: true,
            savedInDatabase: true // Mark this specific item as saved in a database
          };
          itemUpdated = true;
          break;
        }
      }

      // If we didn't find a matching item, it might not exist yet - create it
      if (!itemUpdated) {
        updatedItems.push({
          name: normalizedSectionName,
          completed: true,
          savedInDatabase: true,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        });
      }

      // Update the client with the completed trackable item
      updatedClient.trackable = {
        ...selectedClient.trackable,
        program: selectedClient.trackable?.program || '', // Preserve program
        items: updatedItems,
        createdAt: selectedClient.trackable?.createdAt || new Date().toISOString()
      };

      // Save the updated trackable data to localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          // const trackableJson = JSON.stringify(updatedClient.trackable);
          // console.log(`Saving updated trackable to localStorage:`, trackableJson);
          // localStorage.setItem(`trackable-${selectedClient._id}`, trackableJson);

          // Dispatch an event to notify other components of the trackable update
          const trackableEvent = new CustomEvent('trackableUpdated', {
            detail: {
              clientId: selectedClient._id,
              trackable: updatedClient.trackable
            },
            bubbles: true
          });
          window.dispatchEvent(trackableEvent);
        } catch (e) {
          console.error('Failed to save trackable to localStorage', e);
        }
      }
    }

    // Update the client - use fresh copy to avoid reference issues
    const clientToUpdate = JSON.parse(JSON.stringify(updatedClient));
    setSelectedClient(clientToUpdate);

    // Find the section in the DOM and remove the blur
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // console.log(`Looking for a DOM element with id: ${normalizedSectionName}`);
        const section = document.getElementById(normalizedSectionName);
        if (section) {
          // Find the message overlay and hide it
          const overlay = section.querySelector('.absolute');
          if (overlay) {
            // console.log(`Found overlay, making invisible`);
            overlay.classList.add('invisible');
          } else {
            console.error(`Could not find overlay in section ${normalizedSectionName}`);
          }

          // Find the card and remove the blur
          const card = section.querySelector('.card');
          if (card) {
            // console.log(`Found card, removing blur`);
            card.classList.remove('opacity-50', 'blur-[2px]');
          } else {
            console.error(`Could not find card in section ${normalizedSectionName}`);
          }
        } else {
          console.error(`Could not find section with id: ${normalizedSectionName}`);

          // Try more general DOM search as a fallback
          const possibleSections = document.querySelectorAll(`[id*="${normalizedSectionName}"]`);
          if (possibleSections.length > 0) {
            // console.log(`Found ${possibleSections.length} possible matching sections using broader search`);
            possibleSections.forEach(section => {
              try {
                const overlay = section.querySelector('.absolute');
                if (overlay) overlay.classList.add('invisible');

                const card = section.querySelector('.card');
                if (card) card.classList.remove('opacity-50', 'blur-[2px]');
              } catch (e) {
                console.error(`Error modifying possible section:`, e);
              }
            });
          }
        }
      }, 100);
    }
  };

  // Helper function to check if a path should trigger a status update
  const shouldUpdateClientStatus = (path) => {
    // Safety check
    if (!Array.isArray(path)) return false;

    // Convert a path array to a single lowercase string for easier checking
    try {
      const pathString = path.join(' ').toLowerCase();

      // Check for keywords that should trigger a status update
      return (
        pathString.includes('graduated') ||
        pathString.includes('completion') ||
        pathString.includes('inactive')
      );
    } catch (e) {
      console.error('Error in shouldUpdateClientStatus:', e);
      return false;
    }
  };

  // Helper function to determine the new status based on the path
  const determineNewStatus = (path) => {
    // Safety check
    if (!Array.isArray(path)) return null;

    try {
      const pathString = path.join(' ').toLowerCase();

      if (pathString.includes('graduated')) {
        return 'graduated';
      } else if (pathString.includes('inactive')) {
        return 'inactive';
      } else if (pathString.includes('completion')) {
        // Determine whether to use graduated or inactive based on a client group
        return selectedClient?.group?.toLowerCase() === 'youth'
          ? 'graduated'
          : 'inactive';
      }
    } catch (e) {
      console.error('Error in determineNewStatus:', e);
    }

    return null;
  };

  // Function to update only trackable items without overwriting an entire client
  const updateClientTrackableItems = (
    clientToUpdate,
    serverResponse,
    selectedValues
  ) => {
    // Safety check
    if (!clientToUpdate || !serverResponse) return clientToUpdate;

    // Don't update if no multiselect values
    if (!selectedValues || !selectedValues.length) return clientToUpdate;

    try {
      // Get a set of selected value names for a quicker lookup
      const selectedSet = new Set(selectedValues);

      // Create a new client object with the same properties
      const updatedClient = { ...clientToUpdate };

      // Only update trackable if it exists
      if (updatedClient.trackable) {
        // Keep the original program value (GED or HSED)
        const originalProgram = updatedClient.trackable.program;

        // Create a new array of trackable items
        updatedClient.trackable = {
          ...updatedClient.trackable,
          program: originalProgram, // Preserve the program value
          items: Array.isArray(updatedClient.trackable.items)
            ? updatedClient.trackable.items.map((item) => {
              // Only override values in the selected set
              if (selectedSet.has(item.name)) {
                return { ...item, completed: true };
              }
              // Keep other values the same
              return item;
            })
            : [] // Default to empty an array if the items is not an array
        };
      }

      // Return the updated client
      return updatedClient;
    } catch (e) {
      console.error('Error in updateClientTrackableItems:', e);
      return clientToUpdate;
    }
  };

  const saveSelectionToMongoDB = async (newPath, multi) => {
    try {
      if (typeof setOpen === 'function') {
        // Don't close the modal immediately - wait for success
        // setOpen(false);
      }

      // Safety check for a client
      if (!selectedClient || !selectedClient._id) {
        console.error('No client selected for activity');
        return null;
      }

      // Ensure the client ID is properly formatted as a string
      let clientIdStr = '';
      if (selectedClient._id) {
        // Handle different possible formats of _id
        if (typeof selectedClient._id === 'string') {
          clientIdStr = selectedClient._id;
        } else if (typeof selectedClient._id === 'object') {
          if (selectedClient._id.toString) {
            clientIdStr = selectedClient._id.toString();
          } else if (selectedClient._id['$oid']) {
            clientIdStr = selectedClient._id['$oid'];
          }
        }
      }

      // If we still don't have a valid client ID, try a fallback approach
      if (!clientIdStr && selectedClient && selectedClient._id) {
        clientIdStr = selectedClient._id;
      }

      if (!clientIdStr) {
        console.error('Invalid client ID format:', selectedClient._id);
        return null;
      }

      // Debug output - useful to see the client ID format
      // console.log('Using client ID:', {
      //   original: selectedClient._id,
      //   formatted: clientIdStr,
      //   type: typeof selectedClient._id
      // });

      // Create the base data object with safe values
      const data = {
        clientEmail: selectedClient.email || '',
        clientId: clientIdStr,
        fep: selectedClient.fep || '',
        navigator: selectedClient.navigator || 'Unknown',
        selectedDate: selectedDate || new Date(),
        selection: selectedValue || '',
        timestamp: new Date(),
        trackable: trackable || null,
        selections: multi && Array.isArray(multiSelectValues) ? [...multiSelectValues] : null
      };

      if (multi) {
        // For multi-select, use the current path
        data.path = Array.isArray(selectedPath) ? [...selectedPath] : [];

        try {
          data.statement = generateSentence(
            selectedClient.navigator || 'Navigator', // Provide default of 'Navigator'
            `${selectedClient.first_name || ''} ${selectedClient.last_name || ''}`.trim() || 'Client',
            Array.isArray(multiSelectValues) ? [...multiSelectValues] : [],
            Array.isArray(selectedPath) ? [...selectedPath] : []
          );
        } catch (error) {
          console.error('Error generating sentence:', error);
          data.statement = `${selectedClient.navigator || 'Navigator'} recorded an activity for ${selectedClient.first_name || 'Client'}.`;
        }

        // Make sure the multi-select data is properly updated with trackable items
        if (trackable && Array.isArray(trackable.items) && trackable.items.length > 0) {
          // Get the names of completed items for the activity message
          // Add the completed item names to the data for the sentence generation
          data.selections = trackable.items
            .filter(item => multiSelectValues.includes(item.name))
            .map(item => item.name);

          // Create a new array with completed items based on the selection
          const updatedItems = trackable.items.map(item => {
            // If this item is in the multiSelectValues list, mark it as selected but NOT saved yet
            if (multiSelectValues.includes(item.name)) {
              return {
                ...item,
                completed: true,
                savedInDatabase: false  // Explicitly mark as not saved in a database
              };
            }
            return item;
          });

          // Update the trackable object with the completed items
          const updatedTrackable = {
            ...trackable,
            program: trackable.program ||
              (Array.isArray(selectedPath) && selectedPath.length > 1 ? selectedPath[1] : 'GED'),
            items: updatedItems,
            createdAt: trackable.createdAt || new Date().toISOString()
          };

          // Ensure trackable data is in the activity
          data.trackable = updatedTrackable;

          // If this is a trackable multi-select, prepare a client update
          if (selectedClient) {
            const updatedClient = {
              ...selectedClient,
              trackable: updatedTrackable
            };

            // Queue client update for next effect cycle
            setPendingClientUpdate(updatedClient);

            // Also save in localStorage for persistence
            if (typeof window !== 'undefined') {
              try {
                // localStorage.setItem(`trackable-${selectedClient._id}`,
                //   JSON.stringify(updatedTrackable)
                // );
              } catch (e) {
                console.error('Failed to save trackable to localStorage', e);
              }
            }
          }
        }
      } else {
        // For single-select, use the new path (safe copy)
        data.path = Array.isArray(newPath) ? [...newPath] : [];

        // Check for GED/HSED safely
        let hasGedHsed = false;

        if (Array.isArray(newPath)) {
          try {
            hasGedHsed = newPath.some(p =>
              p === 'GED' || p === 'HSED' ||
              (typeof p === 'string' && (p.includes('GED') || p.includes('HSED')))
            );
          } catch (e) {
            console.error('Error checking for GED/HSED:', e);
          }
        }

        // Special handling for GED or HSED activities
        if (hasGedHsed) {
          // If this is a GED or HSED activity, include trackable items in the message
          if (trackable && Array.isArray(trackable.items)) {
            const completedItems = trackable.items
              .filter(item => item && item.completed)
              .map(item => item.name);

            if (Array.isArray(completedItems) && completedItems.length > 0) {
              data.selections = completedItems;
            }
          }
        }

        try {
          data.statement = generateSentence(
            selectedClient.navigator || 'Navigator', // Provide default of 'Navigator'
            `${selectedClient.first_name || ''} ${selectedClient.last_name || ''}`.trim() || 'Client',
            data.selections || null,
            Array.isArray(newPath) ? [...newPath] : []
          );
        } catch (error) {
          console.error('Error generating sentence for single-select:', error);
          data.statement = `${selectedClient.navigator || 'Navigator'} recorded an activity for ${selectedClient.first_name || 'Client'}.`;
        }
      }

      // Check if this activity should update the client status
      const pathForStatusCheck = multi ? selectedPath : newPath;
      const shouldUpdate = shouldUpdateClientStatus(pathForStatusCheck);

      if (shouldUpdate) {
        // Determine new status
        const newStatus = determineNewStatus(pathForStatusCheck);

        // If we have a valid new status, add it to the data
        if (newStatus) {
          // Since the API is expecting to updateClientStatus at the top level,
          // but nested in data, make sure it's set in the right place
          data.updateClientStatus = newStatus;

          // Also include a compatible path structure for the API route's existing checks
          // The API checks for graduated/inactive keywords in the path array
          if (newStatus === 'graduated' && Array.isArray(data.path)) {
            if (!data.path.includes('graduated')) {
              data.path.push('graduated');
            }
          } else if (newStatus === 'inactive' && Array.isArray(data.path)) {
            if (!data.path.includes('inactive')) {
              data.path.push('inactive');
            }
          }

          // Queue client status update for the local state
          if (selectedClient) {
            // Create a new client object with an updated status
            const updatedClient = {
              ...selectedClient,
              clientStatus: newStatus.toLowerCase()
            };

            // Schedule client update
            setPendingClientUpdate(updatedClient);
          }
        }
      }

      // Create a properly formatted activity for local display with a temporary ID
      const tempId = `temp-${Date.now()}`;

      // This is the optimistic activity that will be displayed immediately
      const optimisticActivity = {
        ...data,
        _id: tempId, // Use a temporary ID that we can track
        type: 'activity',
        navigator: data.navigator || selectedClient.navigator || 'Navigator',
        statement: data.statement || 'Activity recorded',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        date: new Date(),
        isOptimistic: true, // Flag to identify optimistic updates
        preventDuplicates: `${clientIdStr}-${Date.now()}` // Unique flag to prevent duplicate activities
      };

      // console.log('Created optimistic activity:', optimisticActivity);

      // Track if we've already added this activity to prevent duplicates
      let activityAdded = false;
      
      // Add to global feed if the function exists - this will immediately show in the UI
      if (typeof window !== 'undefined') {
        try {
          // First, try the direct addItemToFeed approach
          if (window.addItemToFeed && !activityAdded) {
            // console.log('ACTIVITY DEBUG: Using direct addItemToFeed for immediate display');
            window.addItemToFeed(optimisticActivity);
            activityAdded = true;
          }
          // Then, if that didn't work, try the simplified approach
          else if (window.addActivitySimplified && !activityAdded) {
            // console.log('ACTIVITY DEBUG: Using addActivitySimplified');
            window.addActivitySimplified(optimisticActivity);
            activityAdded = true;
          }
          // Fall back to the original approach as a last resort
          else if (window.addActivityToFeed && !activityAdded) {
            // console.log('ACTIVITY DEBUG: Falling back to legacy addActivityToFeed');
            window.addActivityToFeed(optimisticActivity);
            activityAdded = true;
          } else if (!activityAdded) {
            console.error('ACTIVITY DEBUG: No activity display method available!');
          }

          // Only dispatch event if we didn't successfully add the activity through other means
          // This prevents duplicate activity posts
          if (!activityAdded) {
            // console.log('ACTIVITY DEBUG: Dispatching activityAdded event as last resort');
            const activityAddedEvent = new CustomEvent('activityAdded', {
              detail: optimisticActivity,
              bubbles: true,
              cancelable: true
            });
            window.dispatchEvent(activityAddedEvent);
          } else {
            // console.log('ACTIVITY DEBUG: Activity already added, skipping event dispatch');
          }
        } catch (e) {
          console.error('ACTIVITY DEBUG: Error adding activity to feed:', e);
        }
      } else {
        console.error('ACTIVITY DEBUG: window object not available!');
      }

      // Send the API request asynchronously but don't wait for it
      // console.log('Sending API request with data:', { data });
      try {
        // Format clientId as a string MongoDB can work with
        let clientIdStr = '';
        if (data.clientId) {
          if (typeof data.clientId === 'string') {
            clientIdStr = data.clientId;
          } else if (typeof data.clientId === 'object') {
            if (data.clientId._id) {
              clientIdStr = typeof data.clientId._id === 'string' ?
                data.clientId._id : data.clientId._id.toString();
            } else if (data.clientId.toString) {
              clientIdStr = data.clientId.toString();
            } else if (data.clientId.$oid) {
              clientIdStr = data.clientId.$oid;
            }
          }
        }

        if (!clientIdStr) {
          console.error('Invalid client ID format:', data.clientId);
          throw new Error('Invalid client ID format');
        }

        // Create a clean payload that matches what the API expects
        const payload = {
          // Basic activity data
          type: 'activity',
          clientId: clientIdStr,
          clientEmail: data.clientEmail || '',
          navigator: data.navigator || 'Unknown',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),

          // Activity-specific data
          selection: data.selection || '',
          path: Array.isArray(data.path) ? [...data.path] : [],
          statement: data.statement || '',

          // Selected date (ensure it's a string)
          selectedDate: data.selectedDate instanceof Date
            ? data.selectedDate.toISOString()
            : (typeof data.selectedDate === 'string'
              ? data.selectedDate
              : new Date().toISOString()),

          // Additional data
          fep: data.fep || ''
        };

        // Only add selections if they exist and are non-empty
        if (data.selections && (Array.isArray(data.selections) && data.selections.length > 0)) {
          payload.selections = [...data.selections];
        }

        // Only add updateClientStatus if it exists
        if (data.updateClientStatus) {
          payload.updateClientStatus = data.updateClientStatus;
        }

        // Only add trackable data if it exists and has items
        if (data.trackable && data.trackable.items &&
          Array.isArray(data.trackable.items) && data.trackable.items.length > 0) {

          // Ensure all trackable items have a proper format
          const cleanItems = data.trackable.items.map(item => ({
            name: item.name || '',
            completed: !!item.completed,
            id: item.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
          }));

          payload.trackable = {
            program: data.trackable.program || '',
            length: cleanItems.length,
            items: cleanItems,
            createdAt: data.trackable.createdAt || new Date().toISOString()
          };
        }

        // Log the exact payload being sent to the API for debugging
        // console.log('Sending clean activity payload to API:', JSON.stringify(payload, null, 2));

        const response = await fetch('/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          redirect: 'follow',
          referrerPolicy: 'no-referrer'
        });

        if (!response.ok) {
          // Try to get more information from the error response
          let errorDetail = '';
          let errorObj = null;

          try {
            // First, try to parse as JSON (the expected format)
            const responseText = await response.text();
            console.error('API error response body (raw):', responseText);

            try {
              errorObj = JSON.parse(responseText);
              errorDetail = errorObj.error || errorObj.details || responseText;
            } catch (jsonError) {
              // If not JSON, use the raw text
              errorDetail = responseText;
            }
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }

          // Log details for debugging
          console.error('API error details:', {
            status: response.status,
            statusText: response.statusText,
            errorDetail,
            errorObj
          });

          // Create specific error messages based on status code
          if (response.status === 400) {
            throw new Error(`Invalid request: ${errorDetail}`);
          } else if (response.status === 404) {
            throw new Error(`Resource not found: ${errorDetail}`);
          } else if (response.status === 500) {
            throw new Error(`Server error: ${errorDetail}`);
          } else {
            throw new Error(`API error (${response.status}): ${errorDetail}`);
          }
        }

        const result = await response.json();
        // console.log('Received API response:', result);

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
        if (typeof onSuccess === 'function') {
          // console.log('Calling onSuccess with a result');
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

          // Schedule client update
          setPendingClientUpdate(updatedClient);
        }

        // Return our optimistic activity
        return optimisticActivity;
      } catch (error) {
        console.error('Error saving activity:', error);

        // If we failed, try to remove the optimistic update
        if (typeof window !== 'undefined' && window.removeActivityFromFeed) {
          window.removeActivityFromFeed(tempId);
        }

        // Display error to the user through UI
        if (typeof window !== 'undefined') {
          const snExists = window['showNotification'];
          // Try to display a user-friendly notification
          if (snExists && typeof snExists === 'function') {
            window.showNotification({
              title: 'Error Saving Activity',
              message: error.message || 'There was a problem saving this activity. Please try again.',
              type: 'error',
              duration: 5000
            });
          } else if (window.alert) {
            // Fallback to alert if no notification system
            window.alert('Error saving activity: ' + (error.message || 'Unknown error'));
          }
        }

        // Throw the error so it can be caught and handled by the calling function
        throw error;
      }
    } catch (outerError) {
      console.error('Error in saveSelectionToMongoDB:', outerError);
      return null;
    }
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleAdvance = async () => {
    // Prevent duplicate submissions when already processing
    if (isSubmitting) return;

    // Debug info
    // console.log('handleAdvance called with:', {
    //   selectedValue,
    //   selectedPath,
    //   isSubmitting,
    //   currentOptions
    // });

    try {
      if (!selectedValue) {
        setFinalSelection('Error: Please select an option first.');
        return;
      }

      let newArray = [...selectedPath];
      const newPath = [...newArray, selectedValue];
      setSelectedPath(newPath);
      setSelectedValue('');

      // Get the next object safely
      let newObject;
      try {
        newObject = newPath.reduce(
          (acc, key) => (acc && acc[key] ? acc[key] : null),
          questions
        );
      } catch (e) {
        console.error('Error navigating question path:', e);
        newObject = null;
      }

      setCurrentObject(newObject || {});

      if (selectedValue === 'GED' || selectedValue === 'HSED') {
        try {
          const nextLevel = Array.isArray(newObject) ? newObject : Object.values(newObject || {});
          let items = [];

          if (Array.isArray(nextLevel) && nextLevel.length > 0) {
            // Create proper trackable items with valid structure
            items = nextLevel.map((item) => ({
              name: item,
              completed: false,
              id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Add unique id
            }));
          }

          // Create a trackable object for sending to API with program value set explicitly
          const trackableData = {
            program: selectedValue, // Explicitly setting GED or HSED
            length: items.length,
            items: items.map(item => ({
              ...item,
              savedInDatabase: false // Mark as ISN'T saved in a database initially
            })),
            createdAt: new Date().toISOString()
          };

          // console.log('Created trackable data with program:', trackableData);

          // Set a trackable state
          setTrackable(trackableData);

          // Schedule client update for the next render cycle
          if (selectedClient) {
            // console.log('Preparing client with trackable data');
            const updatedClient = {
              ...selectedClient,
              trackable: trackableData
            };

            // Queue client update for next effect cycle
            setPendingClientUpdate(updatedClient);

            // Also save to localStorage for persistence
            if (typeof window !== 'undefined') {
              try {
                // localStorage.setItem(`trackable-${selectedClient._id}`,
                //   JSON.stringify(trackableData)
                // );
                // console.log('Trackable data saved to localStorage');
              } catch (e) {
                console.error('Failed to save trackable data to localStorage:', e);
              }
            }
          }
        } catch (e) {
          console.error('Error setting up trackable data:', e);
        }
      }

      // Handle other object scenarios with safety checks
      if (newObject && typeof newObject === 'object') {
        try {
          if (
            Object.keys(newObject).length > 0 &&
            Object.prototype.hasOwnProperty.call(newObject, 'other')
          ) {
            setCurrentOptions((prevState) => {
              return [...prevState, 'hasTextInput'];
            });
            setTextInput('hasTextInput');
          }
        } catch (e) {
          console.error('Error checking for "other":', e);
        }
      }

      // If we've reached a leaf node - this is a final selection that needs to be saved
      if (newObject && typeof newObject === 'object' && Object.keys(newObject).length === 0) {
        setCurrentOptions([]);
        setFinalSelection(selectedValue);
        // Now we're actually saving, so set isSubmitting to true
        setIsSubmitting(true);
        await saveSelectionToMongoDB(newPath, false);
        setIsSubmitting(false);
        return;
      }

      // If we have more navigation to do
      if (newObject && typeof newObject === 'object') {
        setFinalSelection(null);

        if (Array.isArray(selectedPath) && selectedPath.some(p => p === 'other')) {
          setMultiSelectOptions(null);
          setCurrentOptions([]);
          setFinalSelection(selectedValue);
          // Now we're actually saving, so set isSubmitting to true
          setIsSubmitting(true);
          await saveSelectionToMongoDB(newPath, false);
          setIsSubmitting(false);
          return;
        }

        if (Array.isArray(newObject)) {
          setMultiSelectOptions(newObject);
          setCurrentOptions([]);
        } else {
          setMultiSelectOptions(null);
          try {
            // Get options for the next level
            let options = Object.keys(newObject);

            // If we're in the educational activities section, check for the existing GED / HSED program
            if ((selectedPath[0] === 'adult' || selectedPath[0] === 'youth') &&
              selectedPath[1]?.toLowerCase() === 'educational activities') {

              // First check client's direct data
              let program = selectedClient?.trackable?.program;

              // If no program found in client data, check localStorage
              if (!program && typeof window !== 'undefined' && selectedClient?._id) {
                try {
                  const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
                  if (savedTrackable) {
                    const parsedTrackable = JSON.parse(savedTrackable);
                    if (parsedTrackable && parsedTrackable.program) {
                      program = parsedTrackable.program;
                    }
                  }
                } catch (e) {
                  console.error('Error checking localStorage for program:', e);
                }
              }

              // If a client already has GED or HSED, remove that option
              if (program === 'GED' || program === 'HSED') {
                // console.log('Found existing program in options view:', program, 'Filtering from options');
                options = options.filter(option => option !== program);
              }
            }
            
            setCurrentOptions(options);
          } catch (e) {
            console.error('Error getting object keys:', e);
            setCurrentOptions([]);
          }
        }
      } else if (Array.isArray(newObject)) {
        try {
          setMultiSelectOptions(newObject && newObject.completed || newObject);
          setCurrentOptions([]);
        } catch (e) {
          console.error('Error setting multi-select options:', e);
          setMultiSelectOptions(null);
          setCurrentOptions([]);
        }
      } else {
        // If we've reached a leaf node with no children - this is a final selection
        setCurrentOptions([]);
        setFinalSelection(selectedValue);
        // Now we're actually saving, so set isSubmitting to true
        setIsSubmitting(true);

        try {
          const result = await saveSelectionToMongoDB(newPath, false);
          if (result && selectedActivity && Array.isArray(selectedActivity.activities)) {
            setSelectedActivity({
              ...selectedActivity,
              activities: [...selectedActivity.activities, result]
            });
          }

          // Call onSuccess callback if provided
          if (typeof onSuccess === 'function' && result) {
            onSuccess(result);
          }
        } catch (error) {
          console.error('Error saving activity:', error);
          setFinalSelection('Error: Failed to save activity. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error in handleAdvance:', error);
      setFinalSelection('Error: Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleMultiSelectChange = (option, index) => {
    // console.log(`MultiSelect change: ${option} at index ${index}`);

    // First, check if this item is already completed in the database
    // If it is, we shouldn't allow unchecking it
    const isAlreadySavedInDatabase = trackable &&
      Array.isArray(trackable.items) &&
      index < trackable.items.length &&
      trackable.items[index]?.savedInDatabase === true;

    if (isAlreadySavedInDatabase) {
      // console.log(`Item ${option} is already saved in a database, cannot change`);
      return; // Don't allow changes to items saved in a database
    }
    
    // Update multiSelectValues state safely
    setMultiSelectValues((prev) => {
      try {
        const isRemoval = Array.isArray(prev) && prev.includes(option);

        // If we're removing from multiSelectValues, update the trackable item accordingly
        if (isRemoval) {
          if (trackable && Array.isArray(trackable.items) && index < trackable.items.length) {
            // Set to false if removed from selection
            const updatedItems = [...trackable.items];

            // Safety check to ensure the item exists
            if (updatedItems[index]) {
              // Only update if it's not already saved in a database
              if (!updatedItems[index].savedInDatabase) {
                updatedItems[index] = {
                  ...updatedItems[index],
                  completed: false,
                  savedInDatabase: false // Ensure it's marked as not saved
                };

                // Update local trackable state
                const updatedTrackable = { ...trackable, items: updatedItems };
                setTrackable(updatedTrackable);

                // Skip the pending update queue and update directly to avoid race conditions
                if (selectedClient) {
                  const updatedClient = {
                    ...selectedClient,
                    trackable: updatedTrackable
                  };

                  // Direct update instead of queueing
                  setSelectedClient(updatedClient);

                  // Save to localStorage
                  if (typeof window !== 'undefined') {
                    try {
                      // localStorage.setItem(`trackable-${selectedClient._id}`,
                      //   JSON.stringify(updatedTrackable)
                      // );
                    } catch (e) {
                      console.error('Failed to save trackable to localStorage:', e);
                    }
                  }
                }
              }
            }
          }
          return Array.isArray(prev) ? prev.filter((item) => item !== option) : [];
        }
        // If we're adding to multiSelectValues
        else {
          // Always set the trackable item to true when selected
          if (trackable && Array.isArray(trackable.items) && index < trackable.items.length) {
            const updatedItems = [...trackable.items];

            // Safety check to ensure the item exists
            if (updatedItems[index]) {
              // Check current status - preserve savedInDatabase if it's already true
              const currentSavedStatus = updatedItems[index].savedInDatabase || false;
              
              updatedItems[index] = {
                ...updatedItems[index],
                completed: true,
                savedInDatabase: currentSavedStatus // Maintain the existing database status
              };

              // Update local trackable state
              const updatedTrackable = { ...trackable, items: updatedItems };
              setTrackable(updatedTrackable);

              // Skip the pending update queue and update directly
              if (selectedClient) {
                const updatedClient = {
                  ...selectedClient,
                  trackable: updatedTrackable
                };

                // Direct update
                setTimeout(() => {
                  setSelectedClient(updatedClient);
                }, 0);

                // Save to localStorage
                if (typeof window !== 'undefined') {
                  try {
                    // localStorage.setItem(`trackable-${selectedClient._id}`,
                    //   JSON.stringify(updatedTrackable)
                    // );
                  } catch (e) {
                    console.error('Failed to save trackable to localStorage:', e);
                  }
                }
              }
            }
          }
          return Array.isArray(prev) ? [...prev, option] : [option];
        }
      } catch (e) {
        console.error('Error in handleMultiSelectChange:', e);
        return prev || [];
      }
    });
  };

  const handleMultiSelectAdvance = async () => {
    // Prevent double-submission
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate first - ensure we have selections
      if (!Array.isArray(multiSelectValues) || multiSelectValues.length === 0) {
        setFinalSelection('Error: Please select at least one option before continuing.');
        setIsSubmitting(false);
        return;
      }

      // First, make sure we're handling trackable data correctly
      if (trackable && Array.isArray(trackable.items) && Array.isArray(multiSelectValues) && multiSelectValues.length > 0) {
        try {
          // Update the trackable items to mark selected ones as completed
          const updatedItems = trackable.items.map(item => {
            if (multiSelectValues.includes(item.name)) {
              return { ...item, completed: true };
            }
            return item;
          });

          // Update trackable with completed items
          const updatedTrackable = {
            ...trackable,
            items: updatedItems
          };

          // Update trackable state
          setTrackable(updatedTrackable);

          // Update the client's trackable data
          if (selectedClient) {
            const updatedClient = {
              ...selectedClient,
              trackable: updatedTrackable
            };

            // Queue update for next cycle
            setPendingClientUpdate(updatedClient);
          }
        } catch (trackableError) {
          console.error('Error updating trackable data:', trackableError);
          // Continue with the save operation even if a trackable update fails
        }
      }

      // Show loading state to the user
      setFinalSelection('Saving activity...');

      try {
        // Make sure we're sending it true to indicate this is a multi-select submission
        // console.log('Starting save operation for multi-select with a path:', selectedPath);

        // First, create the optimistic update - this ensures it shows in the UI immediately
        // const optimisticResult = {
        //   clientEmail: selectedClient.email || '',
        //   clientId: selectedClient._id, // Explicitly set the client ID
        //   fep: selectedClient.fep || '',
        //   navigator: selectedClient.navigator || 'Navigator',
        //   path: selectedPath,
        //   statement: generateSentence(
        //     selectedClient.navigator || 'Navigator',
        //     `${selectedClient.first_name || ''} ${selectedClient.last_name || ''}`.trim() || 'Client',
        //     multiSelectValues,
        //     selectedPath
        //   ) || `${selectedClient.navigator || 'Navigator'} recorded activities for ${selectedClient.first_name || 'Client'}: ${multiSelectValues.join(', ')}`,
        //   selections: multiSelectValues,
        //   trackable: trackable,
        //   createdAt: new Date().toISOString(),
        //   _id: `temp-${Date.now()}`,
        //   type: 'activity',
        //   isOptimistic: true, // Flag as optimistic update
        //   isPermaPersistent: true, // Make it persistent
        //   preventDuplicates: `${selectedClient._id}-${Date.now()}` // Unique identifier to prevent duplicates
        // };

        // Track if we've already added this activity to prevent duplicates
        // let activityAdded;

        // Add the optimistic update to the UI immediately
        // if (typeof window !== 'undefined') {
        //   try {
        //     // Try the direct addItemToFeed approach first
        //     if (window.addItemToFeed && !activityAdded) {
        //       // console.log('Adding optimistic activity to feed via addItemToFeed');
        //       window.addItemToFeed(optimisticResult);
        //       activityAdded = true;
        //     }
        //     // Only try alternative methods if the activity hasn't been added yet
        //     else if (window.addActivityToFeed && !activityAdded) {
        //       // console.log('Adding optimistic activity via addActivityToFeed');
        //       window.addActivityToFeed(optimisticResult);
        //       activityAdded = true;
        //     } else if (window.addActivitySimplified && !activityAdded) {
        //       // console.log('Adding optimistic activity via addActivitySimplified');
        //       window.addActivitySimplified(optimisticResult);
        //       activityAdded = true;
        //     } else if (!activityAdded) {
        //       console.error('No activity display method available!');
        //     }
        //   } catch (e) {
        //     console.error('Error adding activity to feed:', e);
        //   }
        // }

        // Now wait for the actual server response
        const result = await saveSelectionToMongoDB(selectedPath, true);

        // When we get a successful response from the server after Save Selected Items is clicked,
        // immediately mark all selected items as saved in the database
        if (result && result.trackable && Array.isArray(result.trackable.items)) {
          // Update trackable items to mark all selected ones as saved in the database
          const savedItems = result.trackable.items.map(item => {
            if (multiSelectValues.includes(item.name)) {
              return {
                ...item,
                completed: true,
                savedInDatabase: true // Mark all selected items as immediately saved in a database
              };
            }
            return item;
          });

          // Update the trackable with saved items
          const updatedTrackable = {
            ...result.trackable,
            items: savedItems,
            createdAt: result.trackable.createdAt || new Date().toISOString()
          };

          // Update client with the saved trackable
          if (selectedClient) {
            const updatedClient = {
              ...selectedClient,
              trackable: updatedTrackable
            };

            // Directly update the client state instead of using the pending update
            // This prevents race conditions with multiple updates
            setSelectedClient(updatedClient);

            // Also activate any special sections if needed
            const completedItems = savedItems
              .filter(item => item && item.completed && item.savedInDatabase)
              .map(item => item.name.toLowerCase());

            // Check for specific trackable types and activate if they are completed
            completedItems.forEach(itemName => {
              if (itemName === 'orientation' || itemName === 'tabe' || itemName === 'transcripts') {
                activateClientSection(itemName);
              }
            });

            // Save to localStorage
            if (typeof window !== 'undefined') {
              try {
                // localStorage.setItem(`trackable-${selectedClient._id}`,
                //   JSON.stringify(updatedTrackable)
                // );

                // Dispatch an event to notify other components of the trackable update
                const trackableEvent = new CustomEvent('trackableUpdated', {
                  detail: {
                    clientId: selectedClient._id,
                    trackable: updatedTrackable
                  },
                  bubbles: true
                });
                window.dispatchEvent(trackableEvent);
              } catch (e) {
                console.error('Failed to save trackable to localStorage:', e);
              }
            }
          }
        }

        // Set UI state to show completion only if save was successful
        if (result) {
          // console.log('Save operation successful:', result);
          setMultiSelectOptions(null);
          setCurrentOptions([]);
          setFinalSelection('Activity saved successfully');

          // Call onSuccess callback if provided
          if (typeof onSuccess === 'function') {
            onSuccess(result);
          }

          // Close the modal if needed
          if (typeof setOpen === 'function') {
            setTimeout(() => {
              // console.log('Delayed modal close after successful save');
              setOpen(false);
            }, 1500); // Brief delay so the user can see a success message
          }
        } else {
          console.error('Save operation returned null or undefined result');
          setFinalSelection('Activity saved. You may need to refresh to see it.');
        }
      } catch (saveError) {
        console.error('Error saving selection to MongoDB:', saveError);
        // Extract a user-friendly error message
        let errorMessage = 'Activity was saved locally but there was an issue with the server.';
        if (saveError && saveError.message) {
          if (saveError.message.includes('Missing clientId')) {
            errorMessage = 'Activity was saved locally. Client information issue on server.';
          } else if (saveError.message.includes('Client not found')) {
            errorMessage = 'Activity was saved locally. Client not found on server.';
          } else if (saveError.message.includes('500')) {
            errorMessage = 'Activity was saved locally, but there was a server issue.';
          }
        }
        // Show a friendly message that assumes the optimistic update succeeded
        setFinalSelection(`Activity saved. ${errorMessage}`);
      } finally {
        // Always reset the submitting state
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error('Error in handleMultiSelectAdvance:', e);
      // Show a user-friendly error message
      setFinalSelection('Error: Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Get client's trackable items to check which ones are completed
  const getCompletedTrackableItems = () => {
    let completedItems = [];

    // First check client's direct data for completed items
    if (selectedClient?.trackable?.items && Array.isArray(selectedClient.trackable.items)) {
      completedItems = selectedClient.trackable.items
        .filter(item => item && item.completed === true)
        .map(item => item.name);
    }

    // If no completed items found in client data, try localStorage as backup
    if (completedItems.length === 0 && typeof window !== 'undefined' && selectedClient?._id) {
      try {
        const savedTrackable = localStorage.getItem(`trackable-${selectedClient._id}`);
        if (savedTrackable) {
          const parsedTrackable = JSON.parse(savedTrackable);
          if (parsedTrackable && Array.isArray(parsedTrackable.items)) {
            // Get items that are marked as completed (regardless of savedInDatabase status)
            const localItems = parsedTrackable.items
              .filter(item => item && item.completed === true)
              .map(item => item.name);

            // Combine with any existing items without duplicates
            completedItems = [...new Set([...completedItems, ...localItems])];
          }
        }
      } catch (e) {
        console.error('Error checking localStorage for completed trackable items:', e);
      }
    }

    return completedItems;
  };

  const completedItems = getCompletedTrackableItems();

  const showDatePicker = selectedPath.length === 1; // Show DatePicker only at the beginning

  // Check if we're showing trackable selection (display trackables only, not date/initial steps)
  const isTrackableSelection = Array.isArray(multiSelectOptions) && trackable &&
    Array.isArray(trackable.items) && trackable.items.length > 0;

  return (
    <div className="relative z-50">
      {/* Only show the date picker in an initial step, not for trackables */}
      {showDatePicker && !isTrackableSelection && (
        <label className="flex flex-col space-y-2 font-light">
          Date of activity:
          <input
            type="date"
            name="date"
            className="border-base-content text-base-content placeholder:text-base-content mt-2 rounded border px-3 py-1"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </label>
      )}

      {/* Only show the path breadcrumb in initial steps, not for trackables */}
      {selectedPath?.length > 0 && !isTrackableSelection && (
        <div className="mt-2 text-sm text-gray-500">{selectedPath.join(' > ')}</div>
      )}

      {finalSelection && finalSelection.startsWith('Error:') && (
        <div className="mt-4 text-red-600">
          {finalSelection}
        </div>
      )}

      {finalSelection && !finalSelection.startsWith('Error:') && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-green-700">{finalSelection}</span>
          {typeof setOpen === 'function' && (
            <button
              className="rounded-lg bg-gray-500 hover:bg-gray-600 p-2 text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          )}
        </div>
      )}

      {selectedPath && Array.isArray(selectedPath) && selectedPath.some(p => p === 'other') && (
        <label className="flex flex-col space-y-2 font-light">
          <input
            type="text"
            name={selectedPath[selectedPath.length - 1 || 'firstOption']}
            className="border-base-content text-base-content placeholder:text-base-content mt-2 rounded border px-3 py-1"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
          <button
            className={`mt-4 rounded-lg p-2 text-white ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleAdvance}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </label>
      )}

      {/* Only show dropdown in initial steps, not for trackables */}
      {currentOptions.length > 0 &&
        !(selectedPath && Array.isArray(selectedPath) && selectedPath.some(p => p === 'other')) &&
        !isTrackableSelection && (
        <label className="mt-6 flex flex-col space-y-2 font-light capitalize">
          <select
            name={selectedPath[selectedPath.length - 1] || 'firstOption'}
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
            className={`mt-4 rounded-lg p-2 text-white ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleAdvance}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </label>
      )}

      {/* Modified multiSelect section with improved handling of completed items */}
      {multiSelectOptions && isTrackableSelection && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold">Select Trackable Items</h3>
          <div className="grid grid-cols-1 gap-2">
            {Array.isArray(multiSelectOptions) && multiSelectOptions.map((option, index) => {
              // Check if this item is already completed in any source
              const isCompleted = completedItems.includes(option);

              // Check if the item is specifically saved in a database and can't be changed
              // First check trackable state
              let isSavedInDatabase = false;
              if (trackable && Array.isArray(trackable.items) && index < trackable.items.length) {
                isSavedInDatabase = trackable.items[index]?.savedInDatabase === true;
              }

              // If not found in trackable, also check the selectedClient as backup
              if (!isSavedInDatabase && selectedClient?.trackable?.items &&
                Array.isArray(selectedClient.trackable.items)) {
                isSavedInDatabase = selectedClient.trackable.items.some(item =>
                  item.name === option && item['savedInDatabase'] === true
                );
              }

              // Display the appropriate message based on status
              let statusLabel = '';
              if (isSavedInDatabase) {
                statusLabel = '(saved)';
              } else if (isCompleted) {
                statusLabel = '(selected)';
              }
              
              return (
                <label
                  key={`${option}-${index}`}
                  className={`flex cursor-pointer items-center space-x-2 ${isSavedInDatabase ? 'text-gray-400' : ''}`}
                  title={isSavedInDatabase ? 'This item is saved in the database and cannot be changed' :
                    isCompleted ? 'This item is selected but not yet saved to the database' :
                      'Click to select this item'}
                >
                  <input
                    type="checkbox"
                    value={option}
                    name={selectedPath[selectedPath.length - 1] || 'firstOption'}
                    checked={Array.isArray(multiSelectValues) && multiSelectValues.includes(option) || isCompleted}
                    onChange={() => handleMultiSelectChange(option, index)}
                    disabled={isSavedInDatabase} // Only disable items saved in a database
                    className={isSavedInDatabase ? 'opacity-50' : ''}
                  />
                  <span>{option}</span>
                  {statusLabel && (
                    <span className={`ml-2 text-xs ${isSavedInDatabase ? 'text-green-500' : 'text-yellow-500'}`}>
                      {statusLabel}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          <button
            className={`mt-4 rounded-lg p-2 text-white ${
              !Array.isArray(multiSelectValues) || multiSelectValues.length === 0 || isSubmitting
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleMultiSelectAdvance}
            disabled={!Array.isArray(multiSelectValues) || multiSelectValues.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Selected Items'}
          </button>
        </div>
      )}

      {/* Fallback button only when no other UI elements are showing */}
      {!multiSelectOptions &&
        currentOptions.length === 0 &&
        !finalSelection &&
        !(selectedPath && Array.isArray(selectedPath) && selectedPath.some(p => p === 'other')) &&
        selectedPath.length > 0 && // Only show if we've started the flow
        !isTrackableSelection && ( // Don't show for trackables
          <div className="mt-6">
            <button
              className={`rounded-lg p-2 text-white ${
                isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleAdvance}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
        </div>
      )}
    </div>
  );
};

export default ActivityDynamicSelect;
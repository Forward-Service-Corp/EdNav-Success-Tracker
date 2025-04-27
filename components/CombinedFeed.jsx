"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useClient } from '/contexts/ClientContext';
import { format } from 'date-fns';
import { useNotification } from '/contexts/NotificationContext';
import { useNavigator } from '/contexts/NavigatorsContext';
import Button from './Button';

export default function CombinedFeed() {
  const { selectedClient } = useClient();
  const { selectedNavigator } = useNavigator();
  const [, setActivities] = useState([]);
  const [, setNotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [combinedFeed, setCombinedFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [commentingOn, setCommentingOn] = useState(null); // {id, type} of the item being commented on
  const [commentContent, setCommentContent] = useState("");
  const [expandedComments, setExpandedComments] = useState({}); // Track which items have expanded comments
  const { setNotification } = useNotification();

  // Add activity directly to the feed (for optimistic updates)
  const addActivityToFeed = useCallback(
    (activity) => {
      if (!activity || !selectedClient) {
        // console.log('Unable to add activity: No activity or no selected client', { activity, selectedClient });
        return;
      }

      // Skip empty "Activity recorded" activities without valuable content
      if (!activity.statement && !activity.description && !activity.details && !activity.category) {
        // console.log('Skipping empty activity with no valuable content');
        return;
      }

      // console.log('Adding activity to feed:', activity);

      // Check if this is a replacement for a temporary activity
      if (activity.replace) {
        // console.log(`Replacing temporary activity with ID ${activity.replace}`);
        setActivities((prevActivities) => {
          // Find the temporary activity to replace
          const tempActivity = prevActivities.find(a => a._id === activity.replace);

          if (!tempActivity) {
            // console.log(`Temporary activity with ID ${activity.replace} not found, adding as new`);
            // Mark as permanent, so it doesn't get removed
            return [{
              ...activity,
              replace: undefined,
              isPermaPersistent: true,
              isOptimistic: false
            }, ...prevActivities];
          }

          // console.log(`Found temporary activity to replace:`, tempActivity);

          // Create a new array with the replaced activity, marking as a permanent
          // console.log(`Updated activities array:`, updatedActivities);
          return prevActivities.map((a) =>
            a._id === activity.replace
              ? { ...activity, replace: undefined, isPermaPersistent: true, isOptimistic: false }
              : a,
          );
        });
        return;
      }

      // Format the activity if needed
      const formattedActivity = {
        ...activity,
        type: "activity",
        date: new Date(activity.timestamp || activity.createdAt || Date.now()),
        isPermaPersistent: true, // Mark as permanent, so it doesn't get removed
        // Add a unique fingerprint for better duplicate detection
        fingerprint: JSON.stringify({
          statement: activity.statement || '',
          navigator: activity.navigator || '',
          createdAtApprox: new Date(activity.timestamp || activity.createdAt || Date.now()).getTime() - (new Date(activity.timestamp || activity.createdAt || Date.now()).getTime() % 1000) // Round to nearest second for better comparison
        })
      };

      // Add an ID if one doesn't exist
      if (!formattedActivity._id) {
        formattedActivity._id = `perm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }

      // console.log('Formatted activity with a permanent flag:', formattedActivity);

      // Add to activities state
      setActivities((prevActivities) => {
        // Enhanced duplicate detection - check by ID, fingerprint, or content similarity
        const isDuplicate = prevActivities.some((a) => {
          // Check by exact ID match
          if (a._id && formattedActivity._id && a._id.toString() === formattedActivity._id.toString()) {
            // console.log('Duplicate detected by ID match');
            return true;
          }

          // Check by fingerprint
          if (a.fingerprint && formattedActivity.fingerprint && a.fingerprint === formattedActivity.fingerprint) {
            // console.log('Duplicate detected by fingerprint match');
            return true;
          }

          // Check by content similarity for entries without fingerprints
          if (!a.fingerprint && formattedActivity.statement && a.statement === formattedActivity.statement) {
            // If statements match, check timestamp proximity (within 60 seconds)
            const aTime = new Date(a.timestamp || a.createdAt || 0).getTime();
            const newTime = formattedActivity.date.getTime();
            const timeDiffSeconds = Math.abs(aTime - newTime) / 1000;

            if (timeDiffSeconds < 60) {
              // console.log('Duplicate detected by content similarity and timestamp proximity');
              return true;
            }
          }

          return false;
        });

        if (isDuplicate) {
          // console.log('Activity already exists in feed, not adding duplicate');
          return prevActivities;
        }

        // Store the activity in localStorage for persistence with duplicate checks
        if (typeof window !== 'undefined' && selectedClient?._id) {
          try {
            // Store this activity in localStorage for maximum persistence
            const key = `permanentActivities-${selectedClient._id}`;
            const storedActivities = JSON.parse(localStorage.getItem(key) || '[]');

            // Check if activity already exists in storage
            const existsInStorage = storedActivities.some(a =>
              (a._id && a._id === formattedActivity._id) ||
              (a.fingerprint && a.fingerprint === formattedActivity.fingerprint) ||
              (a.statement === formattedActivity.statement &&
                Math.abs(new Date(a.date).getTime() - formattedActivity.date.getTime()) < 60000)
            );

            if (!existsInStorage) {
              storedActivities.push(formattedActivity);
              localStorage.setItem(key, JSON.stringify(storedActivities));
              // console.log('Activity stored in localStorage for permanent backup');
            } else {
              // console.log('Activity already exists in localStorage, not adding duplicate');
            }
          } catch (e) {
            console.error('Failed to store in localStorage:', e);
          }
        }

        // console.log('Adding new permanent activity to state', [formattedActivity, ...prevActivities]);
        return [formattedActivity, ...prevActivities];
      });

      // Use a single integrity check instead of multiple
      const activityId = formattedActivity._id;
      const checkActivityExists = () => {
        setActivities(prevActivities => {
          // Only add back if it doesn't already exist by any detection method
          const exists = prevActivities.some(a => {
            // Check by ID
            if (a._id === activityId) return true;

            // Check by fingerprint
            if (a.fingerprint && formattedActivity.fingerprint &&
              a.fingerprint === formattedActivity.fingerprint) return true;

            // Check by content and timestamp
            if (a.statement === formattedActivity.statement) {
              const timeDiff = Math.abs(
                new Date(a.timestamp || a.createdAt || 0).getTime() -
                formattedActivity.date.getTime()
              ) / 1000;
              if (timeDiff < 60) return true;
            }

            return false;
          });

          if (!exists) {
            // console.log(`Activity integrity check: re-adding activity that may have disappeared`);
            return [formattedActivity, ...prevActivities];
          }
          return prevActivities;
        });
      };

      // Single integrity check after 5 seconds
      setTimeout(checkActivityExists, 5000);
    },
    [selectedClient],
  );

  // Remove a temporary activity if the API call fails
  const removeActivityFromFeed = useCallback((activityId) => {
    if (!activityId) return;

    setActivities((prevActivities) =>
      prevActivities.filter((a) => a._id !== activityId),
    );
  }, []);

  // Create a memoized refresh function
  const refreshFeed = useCallback(() => {
    // console.log('Manual refresh of feed requested');
    if (selectedClient && selectedClient._id) {
      // Always preserve optimistic updates when manually refreshing
      loadData(true).then();
    }
  }, [selectedClient]);

  // Expose the functions globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // console.log('Exposing global feed functions');

      // Original function maintained for backward compatibility
      window.addActivityToFeed = addActivityToFeed;
      window.removeActivityFromFeed = removeActivityFromFeed;
      window.refreshActivityFeed = refreshFeed;

      // New ultra simple approach for adding items directly to the feed
      window.addItemToFeed = (item) => {
        // console.log('FEED DEBUG: Adding item directly to combined feed:', item);

        // If no client selected, can't add items
        if (!selectedClient || !selectedClient._id) {
          console.error('FEED DEBUG: Cannot add item - no client selected');
          return null;
        }

        // Make sure the item has a client ID that matches the selected client
        if (!item.clientId) {
          // console.log('FEED DEBUG: Item missing clientId, adding current client ID');
          item.clientId = selectedClient._id;
        } else if (item.clientId !== selectedClient._id) {
          console.warn('FEED DEBUG: Item has different clientId than selected client, skipping');
          return null; // Don't add items for other clients
        }

        // Format the item with the proper type and date
        const formattedItem = {
          ...item,
          clientId: selectedClient._id, // Ensure client ID is set
          type: item.type || (item.noteContent ? 'note' : 'activity'),
          date: new Date(item.timestamp || item.createdAt || Date.now())
        };

        // console.log('FEED DEBUG: Formatted item:', formattedItem);

        // MOST DIRECT APPROACH: Add directly to the combined feed first for immediate display
        setCombinedFeed(prev => {
          // Skip if already in the feed
          if (prev.some(existing => existing._id === formattedItem._id)) {
            // console.log('FEED DEBUG: Item already in feed, not adding duplicate');
            return prev;
          }

          // console.log('FEED DEBUG: Added item to feed, new length:', newFeed.length);
          return [formattedItem, ...prev].sort((a, b) => b.date - a.date);
        });

        // Also add to an appropriate state collection for consistency
        if (formattedItem.type === 'note' || formattedItem.isNote || formattedItem.noteContent) {
          // console.log('FEED DEBUG: Adding note to state for consistency');
          setNotes(prev => {
            // Skip if already in notes
            if (prev.some(note => note._id === formattedItem._id)) {
              return prev;
            }
            return [formattedItem, ...prev];
          });
        } else {
          // console.log('FEED DEBUG: Adding activity to state for consistency');
          setActivities(prev => {
            // Skip if already in activities
            if (prev.some(activity => activity._id === formattedItem._id)) {
              return prev;
            }
            return [formattedItem, ...prev];
          });
        }

        // If it's an activity, also persist to localStorage for extra safety
        if (formattedItem.type === 'activity' && selectedClient?._id) {
          try {
            const key = `permanentActivities-${selectedClient._id}`;
            const stored = JSON.parse(localStorage.getItem(key) || '[]');

            // Skip if already in localStorage
            if (!stored.some(s => s._id === formattedItem._id)) {
              stored.push(formattedItem);
              localStorage.setItem(key, JSON.stringify(stored));
              // console.log('FEED DEBUG: Also saved to localStorage');
            }
          } catch (e) {
            console.error('FEED DEBUG: Error saving to localStorage:', e);
          }
        }

        return formattedItem;
      };

      // New simplified optimistic update functions
      window.optimisticallyAddActivity = (activity) => {
        // console.log('Optimistically adding activity to state:', activity);

        // Add directly to state with a forced re-render
        setActivities(prev => {
          // console.log('Current activities before adding: ', prev.length);
          // console.log('New activities after adding:', newActivities.length);
          return [activity, ...prev];
        });

        // Also add directly to the combined feed for immediate feedback
        setCombinedFeed(prev => {
          // console.log('Adding directly to combined feed for immediate display');
          const formattedActivity = {
            ...activity,
            type: 'activity',
            date: new Date(activity.timestamp || activity.createdAt || Date.now())
          };
          return [formattedActivity, ...prev].sort((a, b) => b.date - a.date);
        });

        // Force a check after a short delay
        setTimeout(() => {
          setActivities(prev => {
            // console.log('Checking if optimistic activity was added correctly');
            const hasActivity = prev.some(a => a._id === activity._id);
            // console.log('Activity present in state:', hasActivity);
            if (!hasActivity) {
              // console.log('Activity was not found, re-adding it');
              return [activity, ...prev];
            }
            return prev;
          });
        }, 500);
      };

      window.replaceOptimisticActivity = (tempId, realActivity) => {
        // console.log('Replacing optimistic activity with real one:', { tempId, realActivity });

        // Replace in activities state
        setActivities(prev =>
          prev.map(a =>
            a._id === tempId
              ? {
                ...realActivity,
                type: 'activity',
                date: new Date(realActivity.timestamp || realActivity.createdAt || Date.now())
              }
              : a
          )
        );

        // Also replace in combined feed for consistency
        setCombinedFeed(prev =>
          prev.map(item =>
            (item.type === 'activity' && item._id === tempId)
              ? {
                ...realActivity,
                type: 'activity',
                date: new Date(realActivity.timestamp || realActivity.createdAt || Date.now())
              }
              : item
          )
        );
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        // console.log('Cleaning up global feed functions');
        delete window.addActivityToFeed;
        delete window.removeActivityFromFeed;
        delete window.refreshActivityFeed;
        delete window.optimisticallyAddActivity;
        delete window.replaceOptimisticActivity;
        delete window.addItemToFeed;
      }
    };
  }, [addActivityToFeed, removeActivityFromFeed, refreshFeed]);

  // A completely simplified loadData function focused only on API calls
  const loadData = async () => {
    // console.log('LOAD DEBUG: loadData called');
    
    // Only load data if there's a selected client
    if (!selectedClient || !selectedClient._id) {
      // console.log('LOAD DEBUG: No client selected, resetting states');
      setActivities([]);
      setNotes([]);
      setComments([]);
      setCombinedFeed([]);
      return;
    }

    setLoading(true);
    try {
      // console.log('LOAD DEBUG: Loading data for a client:', selectedClient._id);

      // Load all data - simplifying to just sequential calls for now
      // console.log('LOAD DEBUG: Fetching activities');
      const activityResponse = await fetch(`/api/activities?clientId=${selectedClient._id}`);
      const activityData = activityResponse.ok ? await activityResponse.json() : { data: [] };
      const fetchedActivities = activityData.data || [];
      // console.log('LOAD DEBUG: Fetched activities:', fetchedActivities.length);

      // console.log('LOAD DEBUG: Fetching notes');
      const notesResponse = await fetch(`/api/notes?clientId=${selectedClient._id}`);
      const notesData = notesResponse.ok ? await notesResponse.json() : [];
      // console.log('LOAD DEBUG: Fetched notes:', notesData.length);

      // console.log('LOAD DEBUG: Fetching comments');
      const commentsResponse = await fetch(`/api/comments?clientId=${selectedClient._id}`);
      const commentsData = commentsResponse.ok ? await commentsResponse.json() : [];
      // console.log('LOAD DEBUG: Fetched comments:', commentsData.length);

      // Process activities - filter out empty ones
      // console.log('LOAD DEBUG: Processing activities');
      const validActivities = fetchedActivities.filter(activity =>
        activity.statement || activity.description || activity.details || activity.category
      );
      // console.log('LOAD DEBUG: Valid activities after filtering:', validActivities.length);

      // Format activities for the feed
      const formattedActivities = validActivities.map(activity => ({
        ...activity,
        type: 'activity',
        date: new Date(activity.timestamp || activity.createdAt || Date.now())
      }));

      // Format notes for the feed
      // console.log('LOAD DEBUG: Processing notes');
      const formattedNotes = (notesData || []).map(note => ({
        ...note,
        type: 'note',
        date: new Date(note.createdAt || Date.now())
      }));

      // Set individual state collections
      setActivities(formattedActivities);
      setNotes(formattedNotes);
      setComments(commentsData || []);

      // Create a combined feed with everything in a single array
      // console.log('LOAD DEBUG: Creating combined feed');

      // Start with a fresh array from API data
      let newFeed = [...formattedActivities, ...formattedNotes];

      // Check for any existing items that should be preserved (optimistic updates)
      // Crucially, ONLY preserve items that match the current client ID
      const existingItems = combinedFeed.filter(item =>
        // Only preserve items that belong to the current client
        item.clientId === selectedClient._id &&
        // And are either flagged as optimistic
        (item.isOptimistic === true ||
          // Or items with a permanent flag
          item.isPermaPersistent === true)
      );

      // console.log(`LOAD DEBUG: Found ${existingItems.length} optimistic items for current client`);

      // Add existing optimistic items but avoid duplicates
      existingItems.forEach(item => {
        // Skip if this ID already exists in the new feed
        if (!newFeed.some(newItem => newItem._id === item._id)) {
          newFeed.push(item);
        }
      });

      // Sort the combined feed by date
      newFeed.sort((a, b) => b.date - a.date);

      // console.log('LOAD DEBUG: Combined feed created with items:', newFeed.length);
      // console.log('LOAD DEBUG: API activities:', formattedActivities.length);
      // console.log('LOAD DEBUG: API notes:', formattedNotes.length);
      // console.log('LOAD DEBUG: Preserved optimistic/permanent items:', existingItems.length);

      // Set a combined feed state
      setCombinedFeed(newFeed);
      
    } catch (error) {
      console.error('LOAD DEBUG: Error loading feed data:', error);
      setNotification({
        type: "error",
        message: "Failed to load client feed",
        active: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset state when a client changes
  useEffect(() => {
    // console.log('Client selection changed, resetting state');

    // Only reset if the client has actually changed
    if (selectedClient && selectedClient._id) {
      // console.log('Resetting state for a client:', selectedClient._id);

      // Clear states when a client changes - we don't want to preserve
      // optimistic updates from a different client
      setActivities([]);
      setNotes([]);
      setComments([]);
      setCombinedFeed([]);
      setIsAddingNote(false);
      setNoteContent('');
      setCommentingOn(null);
      setCommentContent('');
      setExpandedComments({});

      // Load data for the new client - no need to preserve optimistic updates
      // as we just cleared them
      // console.log('Loading initial data for a client:', selectedClient._id);
      loadData(false).then();
    }
  }, [selectedClient?._id]); // Only depend on client ID, not the entire selectedClient object

  // Directly combine items after data loads, not via useEffect
  useEffect(() => {
    // Manually combine the feed only after client changes to avoid dependency issues
    if (selectedClient && selectedClient._id) {
      // console.log('Client selected, loading data initially');
      loadData().then();
    }
  }, [selectedClient?._id]); // Only depend on client ID

  const handleAddNote = async () => {
    if (!noteContent.trim() || !selectedClient || !selectedClient._id) return;

    try {
      const navigatorName =
        typeof window !== "undefined"
          ? localStorage.getItem("navigatorName") ||
            selectedNavigator?.name ||
            "Unknown"
          : selectedNavigator?.name || "Unknown";

      const noteData = {
        noteContent,
        noteAuthor: navigatorName,
        clientId: selectedClient._id,
        isNote: true,
        createdAt: new Date().toISOString(),
      };

      // Create a unique temporary ID
      const tempId = `temp-${Date.now()}`;
      
      // Optimistically add to UI first for immediate feedback
      const optimisticNote = {
        ...noteData,
        _id: tempId,
        type: "note",
        date: new Date(),
        isOptimistic: true // Flag to identify optimistic updates
      };

      // Add directly to both states to ensure visibility
      setNotes((prevNotes) => [optimisticNote, ...prevNotes]);

      // Also add directly to the combined feed for immediate visibility
      setCombinedFeed(prevFeed => {
        // Check if already in the feed
        if (prevFeed.some(item => item._id === tempId)) {
          return prevFeed;
        }
        // Add and re-sort
        return [optimisticNote, ...prevFeed].sort((a, b) => b.date - a.date);
      });

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const result = await response.json();

      // Update with real data from the server but keep the same ID to avoid reordering
      const realNote = {
        ...(result.note || {}),
        _id: result.note?._id || result._id || tempId,
        type: 'note',
        date: new Date(result.note?.createdAt || Date.now()),
        isOptimistic: false
      };

      // Update notes state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === tempId ? realNote : note
        ),
      );

      // Also update the combined feed
      setCombinedFeed(prevFeed =>
        prevFeed.map(item =>
          (item._id === tempId && item.type === 'note') ? realNote : item
        )
      );

      // Clear form
      setNoteContent("");
      setIsAddingNote(false);

      // Show notification but make sure it won't affect our state
      setNotification({
        type: "success",
        message: "Note added successfully",
        active: true,
      });
    } catch (error) {
      console.error("Error adding note:", error);

      // Remove the optimistic update on error
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== tempId)
      );

      // Also remove from the combined feed
      setCombinedFeed(prevFeed =>
        prevFeed.filter(item => !(item._id === tempId && item.type === 'note'))
      );

      // Show error notification
      setNotification({
        type: "error",
        message: "Failed to add note",
        active: true,
      });
    }
  };

  const handleAddComment = async () => {
    if (
      !commentContent.trim() ||
      !commentingOn ||
      !selectedClient ||
      !selectedClient._id
    )
      return;

    try {
      const navigatorName =
        typeof window !== "undefined"
          ? localStorage.getItem("navigatorName") ||
            selectedNavigator?.name ||
            "Unknown"
          : selectedNavigator?.name || "Unknown";

      const commentData = {
        commentContent,
        commentAuthor: navigatorName,
        clientId: selectedClient._id,
        isComment: true,
        parentId: commentingOn.id,
        parentType: commentingOn.type,
        createdAt: new Date().toISOString(),
      };

      // Create a unique ID for the optimistic update
      const tempId = `temp-${Date.now()}`;
      
      // Optimistically add comment to UI first
      const optimisticComment = {
        ...commentData,
        _id: tempId,
        isOptimistic: true
      };

      setComments((prevComments) => [optimisticComment, ...prevComments]);

      // Auto-expand comments for this item
      setExpandedComments((prev) => ({
        ...prev,
        [commentingOn.id]: true,
      }));

      // Use the comments API for adding comments
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const result = await response.json();

      // Update with real data from the server
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === tempId
            ? {
              ...result.comment,
              _id: result.comment?._id || result._id,
              isOptimistic: false
            }
            : comment,
        ),
      );

      // Clear form and reset commenting state
      setCommentContent("");
      setCommentingOn(null);

      // Show notification without affecting another state
      setNotification({
        type: "success",
        message: "Comment added successfully",
        active: true,
      });
    } catch (error) {
      console.error("Error adding comment:", error);

      // Remove the optimistic comment on error - use the flag to identify it
      setComments((prevComments) =>
        prevComments.filter((comment) => !comment.isOptimistic)
      );

      // Show error notification
      setNotification({
        type: "error",
        message: "Failed to add comment",
        active: true,
      });
    }
  };

  const toggleComments = (itemId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const openActivityModal = () => {
    // This function should open the ActivityModal
    if (typeof window !== 'undefined') {
      // console.log('CombinedFeed trying to open activity modal');
      // console.log('window.openActivityModal exists:', !!window.openActivityModal);

      // Force modal state directly if possible
      if (typeof window !== 'undefined') {
        // Create a custom event that will be picked up by any component listening for it
        const event = new CustomEvent('openActivityModal', { detail: { open: 'activity' } });
        window.dispatchEvent(event);
        // console.log('Dispatched openActivityModal event');
      }

      // Still try the traditional approach as a fallback
      if (window.openActivityModal) {
        try {
          window.openActivityModal();
          // console.log('Activity modal should now be open via global function');
        } catch (error) {
          console.error('Error opening activity modal:', error);
          setNotification({
            type: 'error',
            message: 'Error opening activity modal',
            active: true
          });
        }
      } else {
        console.warn('Activity modal function not found - using event approach only');
        // We've already dispatched the event, so no notification needed
      }
    }
  };

  // Set up event listener for activity, added events and check for persisted activities
  useEffect(() => {
    // Create a function to check for and restore persisted activities
    const checkPersistedActivities = () => {
      // console.log('Checking for persisted activities');

      if (typeof window !== 'undefined' && selectedClient?._id) {
        try {
          // Check for permanently stored activities (this is the one with real activities)
          const permKey = `permanentActivities-${selectedClient._id}`;
          const permActivities = JSON.parse(localStorage.getItem(permKey) || '[]');

          // console.log('Found stored permanent activities to restore:', permActivities.length);

          if (permActivities.length > 0) {
            // Filter to ensure we only restore activities for THIS client
            const clientActivities = permActivities.filter(activity =>
              activity.clientId === selectedClient._id
            );

            // console.log(`Filtered activities for the current client: ${clientActivities.length}`);

            if (clientActivities.length > 0) {
              // DIRECT APPROACH: Add these activities directly to the combined feed
              // This bypasses all the state management complexity
              setCombinedFeed(prev => {
                const newItems = [];

                clientActivities.forEach(activity => {
                  // Format the activity properly
                  const formattedActivity = {
                    ...activity,
                    type: activity.type || 'activity',
                    date: new Date(activity.timestamp || activity.createdAt || Date.now())
                  };

                  // Skip if this activity is already in the feed
                  if (!prev.some(item => item._id === formattedActivity._id)) {
                    newItems.push(formattedActivity);
                  }
                });

                // If we have new items, add them and re-sort
                if (newItems.length > 0) {
                  // console.log(`Added ${newItems.length} stored activities to feed`);
                  return [...prev, ...newItems].sort((a, b) => b.date - a.date);
                }

                return prev;
              });
            }
          }
        } catch (e) {
          console.error('Error checking for persisted activities:', e);
        }
      }
    };

    // Run the check immediately
    checkPersistedActivities();

    // Set up event listener for activity-added events
    const handleActivityAdded = (event) => {
      // console.log('Activity added event received:', event.detail);

      // Only handle activities for the current client
      if (event.detail && event.detail.clientId === selectedClient?._id) {
        // console.log('Activity is for the current client, will be displayed');
      } else {
        // console.log('Activity is for a different client, ignoring');
      }
    };

    if (typeof window !== 'undefined' && selectedClient) {
      window.addEventListener('activityAdded', handleActivityAdded);

      return () => {
        window.removeEventListener('activityAdded', handleActivityAdded);
      };
    }
  }, [selectedClient]);

  // Get comments for an item
  const getCommentsForItem = (itemId, itemType) => {
    return comments.filter(
      (comment) =>
        comment.parentId === itemId && comment.parentType === itemType,
    );
  };

  // If no client is selected, show an empty placeholder
  if (!selectedClient) {
    return (
      <div className="bg-base-100 w-full rounded shadow">
        <div className="">
          <h2 className="">Client Activity Feed</h2>
          <div className="text-base-content/50 flex  items-center justify-center">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4 h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-lg">No client selected</p>
              <p className="text-sm">
                Select a client to view their activity feed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className=" bg-base-100 h-full w-full shadow">
        <div className="">
          <h2 className="">Activity Feed</h2>
          <div className="flex h-96 items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 h-full w-full rounded shadow">
      <div className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`text-xl`}>Activity Feed</span>
          <div className="flex gap-1 md:gap-2">
            <Button use={`primary`} onClick={() => setIsAddingNote(!isAddingNote)}
                    label={isAddingNote ? 'Cancel' : 'Post Note'} />
            <Button use={`primary`}
              onClick={() => {
                const btn = document.getElementById('postActivityButton');
                if (btn) {
                  btn.innerText = 'Opening...';
                  btn.classList.add('btn-disabled');
                  setTimeout(() => {
                    btn.innerText = 'Post Activity';
                    btn.classList.remove('btn-disabled');
                  }, 2000);
                }

                // Call the actual function
                openActivityModal();

                // Force direct open as a last resort
                if (typeof window !== 'undefined' && window.directOpenModal) {
                  setTimeout(() => {
                    // console.log('Attempting direct modal open as fallback');
                    window.directOpenModal();
                  }, 200);
                }
              }}
                    label={`Post Activity`}
              id="postActivityButton"
            />

          </div>
        </div>

        {/* Note Entry Form */}
        {isAddingNote && (
          <div className=" mt-6">
            <h3 className="mb-2 font-medium">Add Note</h3>
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter note content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="btn btn-sm btn-primary"
              >
                Save Note
              </button>
            </div>
          </div>
        )}

        {/* Comment Entry Form */}
        {commentingOn && (
          <div className=" my-3 rounded p-3">
            <h3 className="mb-2 font-medium">
              Add Comment to{" "}
              {commentingOn.type === "activity" ? "Activity" : "Note"}
              <button
                onClick={() => setCommentingOn(null)}
                className="btn btn-xs btn-ghost float-right"
              >
                ×
              </button>
            </h3>
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={!commentContent.trim()}
                className="btn btn-sm btn-primary"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          {combinedFeed.length === 0 ? (
            <p className="text-base-content/60 py-4 text-center">
              No activities or notes found for this client.
            </p>
          ) : (
            <ul className="">
              {combinedFeed.map((item, index) => {
                const itemComments = getCommentsForItem(item._id, item.type);
                const hasComments = itemComments.length > 0;
                const isExpanded = expandedComments[item._id];

                // Ensure unique keys by combining _id with index when available, or just use index
                const uniqueKey = item._id ? `${item._id}-${index}` : `feed-item-${index}`;
                
                return (
                  <li key={uniqueKey} className="mb-4">
                    <div
                      className={`${item.type === 'activity' ? 'text-primary' : 'text-secondary'}`}
                    >
                      {format(item.date, "MMM d, yyyy")}
                    </div>
                    <div className="w-full">
                      {item.type === "activity" ? (
                        <div>
                          <p className="">
                            {item.statement || "Activity recorded"}
                          </p>
                          <p className="text-xs opacity-70">
                            by {item.navigator || "system"}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="">{item.noteContent}</p>
                          <p className="text-xs opacity-70">
                            by {item.noteAuthor || "unknown"}
                          </p>
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between pt-2">
                        <button
                          onClick={() =>
                            setCommentingOn({ id: item._id, type: item.type })
                          }
                          className="btn btn-xs btn-ghost"
                        >
                          Comment
                        </button>

                        {hasComments && (
                          <button
                            onClick={() => toggleComments(item._id)}
                            className="btn btn-xs btn-ghost"
                          >
                            {isExpanded ? "Hide" : "Show"} {itemComments.length}{" "}
                            {itemComments.length === 1 ? "comment" : "comments"}
                          </button>
                        )}
                      </div>

                      {/* Comments section */}
                      {hasComments && isExpanded && (
                        <div className=" mt-2 pt-2">
                          <ul className="space-y-2">
                            {itemComments.map((comment) => (
                              <li
                                key={comment._id}
                                className="bg-base-200 rounded p-2"
                              >
                                <p className="text-sm">
                                  {comment.commentContent}
                                </p>
                                <p className="text-xs opacity-70">
                                  by {comment.commentAuthor || "unknown"}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {index !== combinedFeed.length - 1 && (
                      <hr className="bg-primary/20" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card-actions mt-4 justify-end">
          <button onClick={() => loadData()} className="btn btn-sm btn-ghost">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

// Default props
CombinedFeed.defaultProps = {
  isNarrow: false
};
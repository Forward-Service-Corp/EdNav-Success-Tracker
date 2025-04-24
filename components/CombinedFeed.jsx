"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useActivities } from '@/contexts/ActivityContext';
import { format } from 'date-fns';
import { useNotification } from '@/contexts/NotificationContext';
import { useNavigators } from '@/contexts/NavigatorsContext';

export default function CombinedFeed() {
  const { selectedClient } = useClients();
  const { selectedActivity, setSelectedActivity } = useActivities();
  const { selectedNavigator } = useNavigators();
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [combinedFeed, setCombinedFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [commentingOn, setCommentingOn] = useState(null); // {id, type} of item being commented on
  const [commentContent, setCommentContent] = useState("");
  const [expandedComments, setExpandedComments] = useState({}); // Track which items have expanded comments
  const { setNotification } = useNotification();

  // Add activity directly to the feed (for optimistic updates)
  const addActivityToFeed = useCallback(
    (activity) => {
      if (!activity || !selectedClient) {
        console.log('Unable to add activity: No activity or no selected client', { activity, selectedClient });
        return;
      }

      console.log('Adding activity to feed:', activity);

      // Check if this is a replacement for a temporary activity
      if (activity.replace) {
        console.log(`Replacing temporary activity with ID ${activity.replace}`);
        setActivities((prevActivities) => {
          // Find the temporary activity to replace
          const tempActivity = prevActivities.find(a => a._id === activity.replace);

          if (!tempActivity) {
            console.log(`Temporary activity with ID ${activity.replace} not found, adding as new`);
            return [{ ...activity, replace: undefined }, ...prevActivities];
          }

          console.log(`Found temporary activity to replace:`, tempActivity);

          // Create a new array with the replaced activity
          const updatedActivities = prevActivities.map((a) =>
            a._id === activity.replace
              ? { ...activity, replace: undefined }
              : a,
          );

          console.log(`Updated activities array:`, updatedActivities);
          return updatedActivities;
        });
        return;
      }

      // Format the activity if needed
      const formattedActivity = {
        ...activity,
        type: "activity",
        date: new Date(activity.timestamp || activity.createdAt || Date.now()),
      };

      console.log('Formatted activity:', formattedActivity);

      // Add to activities state
      setActivities((prevActivities) => {
        // Check if this activity already exists (to prevent duplicates)
        const exists = prevActivities.some(
          (a) =>
            a._id &&
            formattedActivity._id &&
            a._id.toString() === formattedActivity._id.toString(),
        );

        if (exists) {
          console.log('Activity already exists in feed, not adding duplicate');
          return prevActivities;
        }

        console.log('Adding new activity to state', [formattedActivity, ...prevActivities]);
        return [formattedActivity, ...prevActivities];
      });
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
    console.log('Manual refresh of feed requested');
    if (selectedClient && selectedClient._id) {
      // Always preserve optimistic updates when manually refreshing
      loadData(true);
    }
  }, [selectedClient]);

  // Expose the functions globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Exposing global feed functions');
      window.addActivityToFeed = addActivityToFeed;
      window.removeActivityFromFeed = removeActivityFromFeed;
      window.refreshActivityFeed = refreshFeed;
    }

    return () => {
      if (typeof window !== "undefined") {
        console.log('Cleaning up global feed functions');
        delete window.addActivityToFeed;
        delete window.removeActivityFromFeed;
        delete window.refreshActivityFeed;
      }
    };
  }, [addActivityToFeed, removeActivityFromFeed, refreshFeed]);

  const loadData = async (preserveOptimisticUpdates = true) => {
    // Only load data if there's a selected client
    if (!selectedClient || !selectedClient._id) {
      setActivities([]);
      setNotes([]);
      setComments([]);
      setCombinedFeed([]);
      return;
    }

    // If we're preserving optimistic updates, save the current activities
    // that start with "temp-" or "modal-" to add them back later
    let optimisticActivities = [];
    if (preserveOptimisticUpdates) {
      optimisticActivities = activities.filter(activity =>
        activity._id && typeof activity._id === 'string' &&
        (activity._id.startsWith('temp-') || activity._id.startsWith('modal-'))
      );
      console.log('Preserving optimistic activities:', optimisticActivities);
    }

    setLoading(true);
    try {
      // Fetch activities
      const activityResponse = await fetch(
        `/api/activities?clientId=${selectedClient._id}`,
      );
      if (!activityResponse.ok) {
        throw new Error("Failed to fetch activities");
      }
      const activityData = await activityResponse.json();

      // The API returns data in activityData.data
      console.log('Fetched activities data structure:', activityData);

      // Extract activities from the response data
      // The API returns { success: true, data: [] } format
      const fetchedActivities = activityData.data || [];
      console.log('Extracted activities array:', fetchedActivities);

      // Fetch notes
      const notesResponse = await fetch(
        `/api/notes?clientId=${selectedClient._id}`,
      );
      if (!notesResponse.ok) {
        throw new Error("Failed to fetch notes");
      }
      const notesData = await notesResponse.json();

      // Fetch comments
      const commentsResponse = await fetch(
        `/api/comments?clientId=${selectedClient._id}`,
      );
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData || []);
      }

      // If we're preserving optimistic updates, add them back to the fetched activities
      if (preserveOptimisticUpdates && optimisticActivities.length > 0) {
        // Only add back optimistic activities that don't exist in fetched activities
        // (they might have been saved to the server)
        const fetchedIds = new Set(fetchedActivities.map(a => a._id?.toString()));

        const activitiesToAdd = optimisticActivities.filter(a => {
          // If the optimistic activity has a "realId" that's in the fetched data,
          // it means it's already been saved, so we don't need to add it back
          if (a.realId && fetchedIds.has(a.realId.toString())) {
            console.log(`Optimistic activity with realId ${a.realId} already exists in fetched data`);
            return false;
          }
          // If the optimistic activity's ID is in the fetched data,
          // it means it's already been saved, so we don't need to add it back
          if (fetchedIds.has(a._id.toString())) {
            console.log(`Optimistic activity ${a._id} already exists in fetched data`);
            return false;
          }
          // Otherwise, add it back
          return true;
        });

        console.log('Adding optimistic activities back to fetched data:', activitiesToAdd);

        // Combine the fetched activities with the optimistic ones
        const combinedActivities = [...activitiesToAdd, ...fetchedActivities];
        setActivities(combinedActivities);
      } else {
        // If we're not preserving optimistic updates, just set the fetched activities
        setActivities(fetchedActivities);
      }

      setNotes(notesData || []);

      // Log what we're setting to help debug
      console.log('Final activities state after combining:', preserveOptimisticUpdates ?
        [...(optimisticActivities || []), ...fetchedActivities] : fetchedActivities);
      console.log('Setting notes state:', notesData || []);
    } catch (error) {
      console.error("Error loading feed data:", error);
      setNotification({
        type: "error",
        message: "Failed to load client feed",
        active: true,
      });

      // If there was an error, ensure we still keep the optimistic activities
      if (preserveOptimisticUpdates && optimisticActivities.length > 0) {
        setActivities(prevActivities => {
          // Keep any existing activities that aren't optimistic updates
          const nonTempActivities = prevActivities.filter(a =>
            !(a._id && typeof a._id === 'string' &&
              (a._id.startsWith('temp-') || a._id.startsWith('modal-')))
          );

          // Add back the optimistic activities
          return [...optimisticActivities, ...nonTempActivities];
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset state when a client changes
  useEffect(() => {
    console.log('Client selection changed, resetting state');

    // Only reset if the client has actually changed
    if (selectedClient && selectedClient._id) {
      console.log('Resetting state for client:', selectedClient._id);

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
      console.log('Loading initial data for client:', selectedClient._id);
      loadData(false);
    }
  }, [selectedClient?._id]); // Only depend on client ID, not the entire selectedClient object

  useEffect(() => {
    // Combine and sort activities and notes
    console.log('Combining activities and notes for feed:', { activities, notes });
    
    const combined = [
      ...(activities || []).map((activity) => ({
        ...activity,
        type: "activity",
        date: new Date(activity.timestamp || activity.createdAt || Date.now()),
      })),
      ...(notes || []).map((note) => ({
        ...note,
        type: "note",
        date: new Date(note.createdAt || Date.now()),
      })),
    ].sort((a, b) => b.date - a.date);

    console.log('Setting combined feed:', combined);
    setCombinedFeed(combined);
  }, [activities, notes]);

  // Add auto-refresh functionality
  useEffect(() => {
    // Only set up auto-refresh if we have a selected client
    if (!selectedClient || !selectedClient._id) return;

    console.log('Setting up auto-refresh for client:', selectedClient._id);

    // Set up a refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing feed data...');
      // Always preserve optimistic updates during auto-refresh
      loadData(true);
    }, 30000); // 30 seconds

    // Clean up the interval when the component unmounts or client changes
    return () => {
      console.log('Cleaning up auto-refresh interval');
      clearInterval(refreshInterval);
    };
  }, [selectedClient]);

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

      // Optimistically add to UI first for immediate feedback
      const optimisticNote = {
        ...noteData,
        _id: `temp-${Date.now()}`,
        type: "note",
        date: new Date(),
      };

      setNotes((prevNotes) => [optimisticNote, ...prevNotes]);

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

      // Update with real data from the server
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === optimisticNote._id
            ? {
                ...result.note,
                type: "note",
                date: new Date(result.note.createdAt),
              }
            : note,
        ),
      );

      // Clear form
      setNoteContent("");
      setIsAddingNote(false);

      setNotification({
        type: "success",
        message: "Note added successfully",
        active: true,
      });
    } catch (error) {
      console.error("Error adding note:", error);

      // Remove the optimistic update on error
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== `temp-${Date.now()}`),
      );

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

      // Optimistically add comment to UI first
      const optimisticComment = {
        ...commentData,
        _id: `temp-${Date.now()}`,
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

      // Update with real data from server
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === optimisticComment._id
            ? { ...result.comment, _id: result._id }
            : comment,
        ),
      );

      // Clear form and reset commenting state
      setCommentContent("");
      setCommentingOn(null);

      setNotification({
        type: "success",
        message: "Comment added successfully",
        active: true,
      });
    } catch (error) {
      console.error("Error adding comment:", error);

      // Remove the optimistic comment on error
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== `temp-${Date.now()}`),
      );

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
    if (typeof window !== 'undefined' && window.openActivityModal) {
      window.openActivityModal();
    } else {
      setNotification({
        type: "info",
        message: "Activity modal functionality is not yet connected",
        active: true,
      });
    }
  };

  // Set up event listener for activity added events
  useEffect(() => {
    // Create a reference to loadData that we can use in the event handler
    // and won't cause dependency issues
    const handleActivityAdded = (event) => {
      console.log('Activity added event received in CombinedFeed:', event.detail);

      if (!event.detail) {
        console.warn('Activity added event received but no detail provided');
        return;
      }

      // First, try to use the global function to add the activity directly to the feed
      if (event.detail && typeof addActivityToFeed === 'function') {
        console.log('Directly adding activity to feed from event');

        // Make sure the activity has _id and is properly formatted
        const activityToAdd = {
          ...event.detail,
          _id: event.detail._id || `event-${Date.now()}`,
          type: 'activity',
          date: new Date(event.detail.timestamp || event.detail.createdAt || Date.now())
        };

        addActivityToFeed(activityToAdd);
      }

      // Do NOT automatically refresh data from the server, as that might
      // overwrite our optimistic update. The server data will be fetched
      // during the next auto-refresh or manual refresh.
    };

    if (typeof window !== 'undefined' && selectedClient) {
      console.log('Setting up activityAdded event listener');
      window.addEventListener('activityAdded', handleActivityAdded);

      // Clean up on unmount
      return () => {
        console.log('Removing activityAdded event listener');
        window.removeEventListener('activityAdded', handleActivityAdded);
      };
    }
  }, [addActivityToFeed, selectedClient]);

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
      <div className="card bg-base-100 overflow-auto w-full shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Client Activity Feed</h2>
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
      <div className="card bg-base-100 h-full w-full shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Client Activity Feed</h2>
          <div className="flex h-96 items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 h-full w-full shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Client Activity Feed</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="btn btn-sm btn-outline btn-primary"
            >
              {isAddingNote ? "Cancel" : "Post Note"}
            </button>
            <button
              onClick={openActivityModal}
              className="btn btn-sm btn-outline btn-secondary"
            >
              Post Activity
            </button>
          </div>
        </div>

        {/* Note Entry Form */}
        {isAddingNote && (
          <div className="border-base-300 my-3 rounded-lg border p-3">
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
          <div className="border-base-300 my-3 rounded-lg border p-3">
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

        <div className="mt-2 max-h-96 overflow-y-auto">
          {combinedFeed.length === 0 ? (
            <p className="text-base-content/60 py-4 text-center">
              No activities or notes found for this client.
            </p>
          ) : (
            <ul className="timeline timeline-vertical">
              {combinedFeed.map((item, index) => {
                const itemComments = getCommentsForItem(item._id, item.type);
                const hasComments = itemComments.length > 0;
                const isExpanded = expandedComments[item._id];

                return (
                  <li key={item._id || `feed-item-${index}`} className="mb-4">
                    <div
                      className={`timeline-start ${item.type === "activity" ? "text-primary" : "text-secondary"}`}
                    >
                      {format(item.date, "MMM d, yyyy")}
                    </div>
                    <div className="timeline-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-5 w-5 ${item.type === "activity" ? "text-primary" : "text-secondary"}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="timeline-end timeline-box w-full max-w-md">
                      {item.type === "activity" ? (
                        <div>
                          <p className="font-medium">
                            {item.statement || "Activity recorded"}
                          </p>
                          <p className="text-xs opacity-70">
                            by {item.navigator || "system"}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{item.noteContent}</p>
                          <p className="text-xs opacity-70">
                            by {item.noteAuthor || "unknown"}
                          </p>
                        </div>
                      )}

                      <div className="border-base-300 mt-2 flex items-center justify-between border-t pt-2">
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
                        <div className="border-base-300 mt-2 border-t pt-2">
                          <ul className="space-y-2">
                            {itemComments.map((comment) => (
                              <li
                                key={comment._id}
                                className="bg-base-200/50 rounded-md p-2"
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
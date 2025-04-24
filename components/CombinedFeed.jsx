"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useClients } from "../contexts/ClientsContext";
import { useActivities } from "../contexts/ActivityContext";
import { format } from "date-fns";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigators } from "../contexts/NavigatorsContext";

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
  const addActivityToFeed = useCallback((activity) => {
    if (!activity || !selectedClient) return;

    // Check if this is a replacement for a temporary activity
    if (activity.replace) {
      setActivities((prevActivities) => {
        return prevActivities.map((a) =>
          a._id === activity.replace ? { ...activity, replace: undefined } : a,
        );
      });
      return;
    }

    // Format the activity if needed
    const formattedActivity = {
      ...activity,
      type: "activity",
      date: new Date(activity.timestamp || activity.createdAt || Date.now()),
    };

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
        return prevActivities;
      }

      return [formattedActivity, ...prevActivities];
    });
  }, [selectedClient]);
  
  // Remove a temporary activity if API call fails
  const removeActivityFromFeed = useCallback((activityId) => {
    if (!activityId) return;

    setActivities((prevActivities) =>
      prevActivities.filter((a) => a._id !== activityId),
    );
  }, []);

  // Expose the addActivityToFeed function globally
  useEffect(() => {
    if (typeof window"undefined"ined') {
      window.addActivityToFeed = addActivityToFeed;
      window.removeActivityFromFeed = removeActivityFromFeed;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.addActivityToFeed;
        delete window.removeActivityFromFeed;
      }
    };
  }, [addActivityToFeed, removeActivityFromFeed])

  const loadData = async () => {
    // Only load data if there's a selected client
    if (!selectedClient || !selectedClient._id) {
      setActivities([]);
      setNotes([]);
      setComments([]);
      setCombinedFeed([]);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch activities
      const activityResponse = await fetch(`/api/activities?clientId=${selectedClient._id}`);
      if (!activityResponse.ok) {
        throw new Error("Failed to fetch activities");
      }
      const activityData = await activityResponse.json();

      // Fetch notes
      const notesResponse = await fetch(`/api/notes?clientId=${selectedClient._id}`);
      if (!notesResponse.ok) {
        throw new Error("Failed to fetch notes");
      }
      const notesData = await notesResponse.json();

      // Fetch comments
      const commentsResponse = await fetch(`/api/comments?clientId=${selectedClient._id}`);
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData || []);
      }

      setActivities(activityData.data || []);
      setNotes(notesData || []);
    } catch (error) {
      console.error("Error loading feed data:", error);
      setNotification({
        type: "error",
        message: "Failed to load client feed",
        active: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset state when client changes
  useEffect(() => {
    // Clear states when client changes
    setActivities([]);
    setNotes([]);
    setComments([]);
    setCombinedFeed([]);
    setIsAddingNote(false);
    setNoteContent("");
    setCommentingOn(null);
    setCommentContent("");
    setExpandedComments({});

    // Load data for the new client
    loadData();
  }, [selectedClient, selectedActivity]);

  useEffect(() => {
    // Combine and sort activities and notes
    const combined = [
      ...(activities || []).map(activity => ({
        ...activity,
        type: "activity",
        date: new Date(activity.timestamp || activity.createdAt || Date.now())
      })),
      ...(notes || []).map(note => ({
        ...note,
        type: "note",
        date: new Date(note.createdAt || Date.now())
      }))
    ].sort((a, b) => b.date - a.date);

    setCombinedFeed(combined);
  }, [activities, notes]);

  const handleAddNote = async () => {
    if (!noteContent.trim() || !selectedClient || !selectedClient._id) return;

    try {
      const navigatorName = typeof window !== "undefined" ?
        localStorage.getItem("navigatorName") || selectedNavigator?.name || "Unknown" :
        selectedNavigator?.name || "Unknown";

      const noteData = {
        noteContent,
        noteAuthor: navigatorName,
        clientId: selectedClient._id,
        isNote: true,
        createdAt: new Date().toISOString()
      };

      // Optimistically add to UI first for immediate feedback
      const optimisticNote = {
        ...noteData,
        _id: `temp-${Date.now()}`,
        type: "note",
        date: new Date()
      };

      setNotes(prevNotes => [optimisticNote, ...prevNotes]);

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const result = await response.json();

      // Update with real data from server
      setNotes(prevNotes => prevNotes.map(note =>
        note._id === optimisticNote._id ? { ...result.note, type: "note", date: new Date(result.note.createdAt) } : note
      ));

      // Clear form
      setNoteContent("");
      setIsAddingNote(false);

      setNotification({
        type: "success",
        message: "Note added successfully",
        active: true
      });
    } catch (error) {
      console.error("Error adding note:", error);
      
      // Remove the optimistic update on error
      setNotes(prevNotes => prevNotes.filter(note => note._id !== `temp-${Date.now()}`));
      
      setNotification({
        type: "error",
        message: "Failed to add note",
        active: true
      });
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim() || !commentingOn || !selectedClient || !selectedClient._id) return;

    try {
      const navigatorName = typeof window !== "undefined" ?
        localStorage.getItem("navigatorName") || selectedNavigator?.name || "Unknown" :
        selectedNavigator?.name || "Unknown";

      const commentData = {
        commentContent,
        commentAuthor: navigatorName,
        clientId: selectedClient._id,
        isComment: true,
        parentId: commentingOn.id,
        parentType: commentingOn.type,
        createdAt: new Date().toISOString()
      };

      // Optimistically add comment to UI first
      const optimisticComment = {
        ...commentData,
        _id: `temp-${Date.now()}`
      };

      setComments(prevComments => [optimisticComment, ...prevComments]);
      
      // Auto-expand comments for this item
      setExpandedComments(prev => ({
        ...prev,
        [commentingOn.id]: true
      }));

      // Use the comments API for adding comments
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const result = await response.json();

      // Update with real data from server
      setComments(prevComments => prevComments.map(comment =>
        comment._id === optimisticComment._id ? { ...result.comment, _id: result._id } : comment
      ));

      // Clear form and reset commenting state
      setCommentContent("");
      setCommentingOn(null);

      setNotification({
        type: "success",
        message: "Comment added successfully",
        active: true
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      
      // Remove the optimistic comment on error
      setComments(prevComments => prevComments.filter(comment => comment._id !== `temp-${Date.now()}`));
      
      setNotification({
        type: "error",
        message: "Failed to add comment",
        active: true
      });
    }
  };

  const toggleComments = (itemId) => {
    setExpandedComments(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const openActivityModal = () => {
    // This function should open the ActivityModal
    if (window.openActivityModal) {
      window.openActivityModal();
    } else {
      setNotification({
        type: "info",
        message: "Activity modal functionality is not yet connected",
        active: true
      });
    }
  };

  // Get comments for an item
  const getCommentsForItem = (itemId, itemType) => {
    return comments.filter(comment =>
      comment.parentId === itemId && comment.parentType === itemType
    );
  };

  // If no client is selected, show empty placeholder
  if (!selectedClient) {
    return (
      <div className="card h-full w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Client Activity Feed</h2>
          <div className="flex h-96 items-center justify-center text-base-content/50">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">No client selected</p>
              <p className="text-sm">Select a client to view their activity feed</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card h-full w-full bg-base-100 shadow-xl">
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
    <div className="card h-full w-full bg-base-100 shadow-xl">
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
          <div className="my-3 p-3 border border-base-300 rounded-lg">
            <h3 className="font-medium mb-2">Add Note</h3>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="Enter note content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
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
          <div className="my-3 p-3 border border-base-300 rounded-lg">
            <h3 className="font-medium mb-2">
              Add Comment to {commentingOn.type === "activity" ? "Activity" : "Note"}
              <button
                onClick={() => setCommentingOn(null)}
                className="float-right btn btn-xs btn-ghost"
              >
                ×
              </button>
            </h3>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="Enter comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
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
            <p className="text-base-content/60 py-4 text-center">No activities or notes found for this client.</p>
          ) : (
            <ul className="timeline timeline-vertical">
              {combinedFeed.map((item, index) => {
                const itemComments = getCommentsForItem(item._id, item.type);
                const hasComments = itemComments.length > 0;
                const isExpanded = expandedComments[item._id];

                return (
                  <li key={item._id || `feed-item-${index}`} className="mb-4">
                    <div className={`timeline-start ${item.type === "activity" ? "text-primary" : "text-secondary"}`}>
                      {format(item.date, "MMM d, yyyy")}
                    </div>
                    <div className="timeline-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                           className={`w-5 h-5 ${item.type === "activity" ? "text-primary" : "text-secondary"}`}>
                        <path fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="timeline-end timeline-box w-full max-w-md">
                      {item.type === "activity" ? (
                        <div>
                          <p className="font-medium">{item.statement || "Activity recorded"}</p>
                          <p className="text-xs opacity-70">by {item.navigator || "system"}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{item.noteContent}</p>
                          <p className="text-xs opacity-70">by {item.noteAuthor || "unknown"}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-base-300">
                        <button
                          onClick={() => setCommentingOn({ id: item._id, type: item.type })} 
                          className="btn btn-xs btn-ghost"
                        >
                          Comment
                        </button>

                        {hasComments && (
                          <button
                            onClick={() => toggleComments(item._id)} 
                            className="btn btn-xs btn-ghost"
                          >
                            {isExpanded ? "Hide" : "Show"} {itemComments.length} {itemComments.length === 1 ? "comment" : "comments"}
                          </button>
                        )}
                      </div>

                      {/* Comments section */}
                      {hasComments && isExpanded && (
                        <div className="mt-2 pt-2 border-t border-base-300">
                          <ul className="space-y-2">
                            {itemComments.map((comment) => (
                              <li key={comment._id} className="bg-base-200/50 p-2 rounded-md">
                                <p className="text-sm">{comment.commentContent}</p>
                                <p className="text-xs opacity-70">by {comment.commentAuthor || "unknown"}</p>
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

        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => loadData()}
            className="btn btn-sm btn-ghost"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
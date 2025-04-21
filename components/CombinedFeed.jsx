import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useClients } from '@/contexts/ClientsContext';
import NoteModal from '../components/NoteModal';
import ActivityModal from '@/components/ActivityModal';
import CommentDebugger from './CommentDebugger';
import DirectCommentTest from './DirectCommentTest';
import EnhancedCommentForm from './EnhancedCommentForm';
import CommentDisplay from './CommentDisplay';

const CombinedFeed = () => {
  const { selectedClient } = useClients();
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [activeCommentForm, setActiveCommentForm] = useState(null);

  useEffect(() => {
    if (!selectedClient?._id) return;
    fetchFeedData().then();
  }, [selectedClient]);

  // Add event listener to detect clicks outside of comment forms
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click wasn't inside a textarea, clear the active comment form
      if (!event.target.closest('textarea')) {
        setActiveCommentForm(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchFeedData = async () => {
    console.log('=== FETCH FEED DATA STARTED ===');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching feed data for client:', selectedClient._id);
      
      // Fetch activities, notes, and comments
      console.log('Making API requests...');
      const [activitiesRes, notesRes, commentsRes] = await Promise.all([
        fetch(`/api/activities?clientId=${selectedClient._id}`),
        fetch(`/api/notes?clientId=${selectedClient._id}`),
        fetch(`/api/comments?clientId=${selectedClient._id}`)
      ]);

      console.log('API Response status codes:', {
        activities: activitiesRes.status,
        notes: notesRes.status,
        comments: commentsRes.status
      });

      if (!activitiesRes.ok) throw new Error('Failed to fetch activities');
      if (!notesRes.ok) throw new Error('Failed to fetch notes');
      if (!commentsRes.ok) throw new Error('Failed to fetch comments');

      const activitiesData = await activitiesRes.json();
      const notesData = await notesRes.json();
      const commentsData = await commentsRes.json();

      console.log('Data received:');
      console.log('- Activities count:', (activitiesData.data || []).length);
      console.log('- Notes count:', Array.isArray(notesData) ? notesData.length : 'not an array');
      console.log('- Comments count:', Array.isArray(commentsData) ? commentsData.length : 'not an array');

      // Extract the activities array from the response
      const activities = activitiesData.data || [];

      // Notes data should be an array already from the API
      const notes = Array.isArray(notesData) ? notesData : [];

      // Ensure comments is an array
      const comments = Array.isArray(commentsData) ? commentsData : [];

      if (comments.length > 0) {
        console.log('Comment sample:', {
          _id: comments[0]._id,
          parentId: comments[0].parentId,
          commentText: comments[0].commentText?.substring(0, 20) + '...'
        });
      }

      // Group comments by their parent ID
      console.log('Grouping comments by parent ID...');
      const commentsByParent = comments.reduce((acc, comment) => {
        const parentId = comment.parentId;
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(comment);
        return acc;
      }, {});

      const parentIdCount = Object.keys(commentsByParent).length;
      console.log(`Comments grouped by parent ID. Found ${parentIdCount} parents.`);

      // Normalize the data format and attach comments
      console.log('Formatting activities with comments...');
      const formattedActivities = activities.map(activity => {
        const itemId = activity._id;
        const itemComments = commentsByParent[itemId] || [];

        if (itemComments.length > 0) {
          console.log(`Activity ${itemId}: has ${itemComments.length} comments`);
        }

        return {
          ...activity,
          type: 'activity',
          itemId,
          date: activity.selectedDate || activity.createdAt || activity.timestamp,
          content: activity.statement,
          author: activity.navigator || 'System',
          comments: itemComments
        };
      });

      console.log('Formatting notes with comments...');
      const formattedNotes = notes.map(note => {
        const itemId = note._id;
        const itemComments = commentsByParent[itemId] || [];

        if (itemComments.length > 0) {
          console.log(`Note ${itemId}: has ${itemComments.length} comments`);
        }

        return {
          ...note,
          type: 'note',
          itemId,
          date: note.createdAt,
          content: note.noteContent,
          author: note.noteAuthor || 'Unknown',
          comments: itemComments
        };
      });

      // Combine and sort by date (newest first)
      const combined = [...formattedActivities, ...formattedNotes]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log(`Feed data processed successfully. Total items: ${combined.length}`);
      console.log('=== FETCH FEED DATA COMPLETED ===');
      
      setFeedItems(combined);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComments = (itemId) => {
    console.log('Toggle comments for:', itemId);

    // Toggle the expanded state with a callback to ensure we have the latest state
    setExpandedComments(prev => {
      const newState = {
        ...prev,
        [itemId]: !prev[itemId]
      };

      console.log('New expanded state:', newState);

      // If we're expanding this item, set it as the active comment form
      if (newState[itemId]) {
        // Small delay to ensure the DOM is updated before focusing
        setTimeout(() => {
          console.log('Setting active comment form to:', itemId);
          setActiveCommentForm(itemId);
        }, 50);
      }

      return newState;
    });
  };

  const handleCommentFocus = (itemId) => {
    console.log('Focusing comment form for:', itemId);

    // Make sure the comments section is expanded
    setExpandedComments(prev => ({
      ...prev,
      [itemId]: true // Always make sure it's expanded
    }));

    // Set active comment form with small delay to ensure DOM is ready
    setTimeout(() => {
      console.log('Setting active comment form to:', itemId);
      setActiveCommentForm(itemId);
    }, 50);
  };

  const handleAddComment = async (itemId, commentText) => {
    console.log('CombinedFeed.handleAddComment called with:', { itemId, commentText });

    if (!selectedClient?._id) {
      console.error('No selected client');
      throw new Error('No client selected');
    }

    if (!itemId) {
      console.error('No item ID provided');
      throw new Error('Cannot determine where to add comment');
    }

    if (!commentText || !commentText.trim()) {
      console.error('Empty comment text');
      throw new Error('Comment text cannot be empty');
    }

    // Create the comment payload
    const payload = {
      parentId: itemId,
      clientId: selectedClient._id,
      commentText: commentText.trim(),
      createdAt: new Date().toISOString(),
      author: 'Current User'
    };

    console.log('Sending comment payload:', payload);

    // Make the API call
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('API response status:', response.status);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.error || 'Failed to add comment');
    }

    // Parse the success response
    const result = await response.json();
    console.log('API success response:', result);

    // Refresh the feed data to show the new comment
    console.log('Refreshing feed data...');
    await fetchFeedData();

    // Keep the comment section expanded
    setExpandedComments(prev => ({
      ...prev,
      [itemId]: true
    }));

    // Also make sure this item has the active comment form
    setActiveCommentForm(itemId);

    console.log('Comment added successfully');
    return result;
  };

  return (
    <div className={` p-6 bg-base-200 rounded-lg shadow text-xs ml-6 border-1 border-base-content/10`}>
      <NoteModal open={open} setOpen={setOpen} onSuccess={fetchFeedData} />
      <ActivityModal open={open} setOpen={setOpen} onSuccess={fetchFeedData} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Feed</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen('activity')}
            className="btn btn-xs btn-primary"
          >
            Add Activity
          </button>
          <button
            onClick={() => setOpen('note')}
            className="btn btn-xs btn-secondary"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Comment debugging panel - remove this after fixing the issue */}
      <details className="mb-4 collapse collapse-arrow border border-base-300 rounded-box">
        <summary className="collapse-title font-medium">
          Comment System Debugger
        </summary>
        <div className="collapse-content">
          <CommentDebugger />
        </div>
      </details>

      {/* Simple direct test - remove this after fixing the issue */}
      <details className="mb-4 collapse collapse-arrow border border-warning rounded-box">
        <summary className="collapse-title font-medium">
          Direct API Test (No Dependencies)
        </summary>
        <div className="collapse-content">
          <DirectCommentTest />
        </div>
      </details>

      {isLoading && (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

      {error && (
        <div className="bg-error/20 text-error px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {!isLoading && feedItems.length === 0 && (
        <div className="text-center py-8 text-base-content/70">
          No notes or activities yet. Add one to get started.
        </div>
      )}

      <div className="space-y-8">
        {feedItems.map((item) => (
          <div
            key={item.itemId}
            className={`px-3 py-0 border-l-1 ${
              item.type === 'activity'
                ? 'bg-primary/0 border-primary/50'
                : 'bg-secondary/0 border-secondary/50'
            }`}
          >
            {/* Main item content */}
            <div className="flex justify-between text-base-content/70 mb-3">
              <span className={`font-medium`}>{item.author}</span>
              {/*<span>{item.type === 'activity' ? 'Activity': 'Note'} by {item.author}</span>*/}
              <span className={`text-base-content/40`}>{moment(item.date).calendar()}</span>
            </div>
            <div className="whitespace-pre-wrap break-words">
              {item.content}
            </div>

            {/* Comments section */}
            <div className="mt-1 pt-2">
              <div className=" flex justify-end">
              <button
                onClick={() => toggleComments(item.itemId)}
                className="flex items-center justify-end gap-1 underline text-base-content/50 hover:text-base-content">
                <span className="">{item.comments.length} Comments</span>
                {/*<span>{expandedComments[item.itemId] ? 'Hide': 'Show'} Comments</span>*/}
              </button>
              </div>
              {expandedComments[item.itemId] && (
                <div className="mt-2 space-y-2">
                  {item.comments.length > 0 ? (
                    <div className="space-y-3">
                      {item.comments.map((comment) => (
                        <CommentDisplay key={comment._id} comment={comment} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-base-content/60 italic">
                      No comments yet
                    </div>
                  )}

                  {/* Enhanced Comment Form Section */}
                  <div className="mt-3">
                    {activeCommentForm === item.itemId ? (
                      <div className="border border-base-300 p-2 rounded-md">
                        <h4 className="text-xs font-semibold mb-2">Add a comment</h4>
                        <EnhancedCommentForm
                          key={`comment-form-${item.itemId}`}
                          parentId={item.itemId}
                          onAddComment={(text) => handleAddComment(item.itemId, text)}
                        />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer text-base-content/60 hover:text-base-content p-2 rounded border border-dashed border-base-300 text-center"
                        onClick={() => handleCommentFocus(item.itemId)}
                      >
                        Click to add a comment...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombinedFeed;
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useClients } from '../contexts/ClientsContext';
import NoteModal from '../components/NoteModal';
import ActivityModal from '../components/ActivityModal';
import { useNavigators } from '../contexts/NavigatorsContext';

const CombinedFeed = () => {
  const { selectedNavigator } = useNavigators();
  const { selectedClient } = useClients();
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [activeCommentForm, setActiveCommentForm] = useState(null);
  const [commentText, setCommentText] = useState('');

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
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching feed data for client:', selectedClient._id);
      
      // Fetch activities, notes, and comments
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

      console.log('Notes data received:', notesData);

      // Extract the activities array from the response
      const activities = activitiesData.data || [];

      // Notes data should be an array already from the API
      const notes = Array.isArray(notesData) ? notesData : [];
      
      const comments = commentsData || [];

      // Group comments by their parent ID
      const commentsByParent = comments.reduce((acc, comment) => {
        const parentId = comment.parentId;
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(comment);
        return acc;
      }, {});

      // Normalize the data format and attach comments
      const formattedActivities = activities.map(activity => ({
        ...activity,
        type: 'activity',
        itemId: activity._id,
        date: activity.selectedDate || activity.createdAt || activity.timestamp,
        content: activity.statement,
        author: activity.navigator || 'System',
        comments: commentsByParent[activity._id] || []
      }));

      const formattedNotes = notes.map(note => ({
        ...note,
        type: 'note',
        itemId: note._id,
        date: note.createdAt,
        content: note.noteContent,
        author: note.noteAuthor || 'Unknown',
        comments: commentsByParent[note._id] || []
      }));

      // Combine and sort by date (newest first)
      const combined = [...formattedActivities, ...formattedNotes]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setFeedItems(combined);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComments = (itemId) => {
    // When opening a comments section, set the active comment form
    if (!expandedComments[itemId]) {
      setActiveCommentForm(itemId);
    }
    
    setExpandedComments(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAddComment = async (parentId, clientId, author) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentId, clientId, author, commentText,
          createdAt: new Date().toISOString(),
          isNote: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      await fetchFeedData();
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className={` p-6 bg-base-200 rounded-lg shadow  ml-6 border-1 border-base-content/10`}>
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
                    item.comments.map((comment) => (
                      <div key={comment._id} className="pl-4 border-l-2 border-base-300 ">
                        <div className="flex justify-between text-base-content/60">
                          <span>{comment.author}</span>
                          <span>{moment(comment.createdAt).format('MMM D, YYYY h:mm A')}</span>
                        </div>
                        <div className="mt-1">
                          {comment.commentText}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-base-content/60 italic">
                      No comments yet
                    </div>
                  )}

                  {/* Comment form - only shown when this item is the active comment form */}
                  <div className="mt-3">
                    {activeCommentForm === item.itemId ? (
                      // <CommentForm
                      //   parentId={item.itemId}
                      //   onAddComment={(text) => handleAddComment(item.itemId, text)}
                      // />
                      <textarea onChange={e => setCommentText(e.target.value)} value={commentText}
                                className="textarea textarea-bordered " placeholder="Add a comment..." />
                    ) : (
                      <div
                        className="cursor-pointer text-base-content/60 hover:text-base-content p-2 rounded border border-dashed border-base-300 text-center"
                        onClick={() => handleAddComment(item.itemId, selectedClient._id, selectedNavigator?.name, selectedNavigator.name)}
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
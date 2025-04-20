import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useClients } from '@/contexts/ClientsContext';
import CommentForm from './CommentForm';
import NoteModal from '../components/NoteModal';
import ActivityModal from '@/components/ActivityModal'; // We'll create this component

const CombinedFeed = () => {
  const { selectedClient } = useClients();
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState('');
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    if (!selectedClient?._id) return;
    fetchFeedData().then();
  }, [selectedClient]);

  const fetchFeedData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch activities, notes, and comments
      const [activitiesRes, notesRes, commentsRes] = await Promise.all([
        fetch(`/api/activities?clientId=${selectedClient._id}`),
        fetch(`/api/notes?clientId=${selectedClient._id}`),
        fetch(`/api/comments?clientId=${selectedClient._id}`)
      ]);

      if (!activitiesRes.ok) throw new Error('Failed to fetch activities');
      if (!notesRes.ok) throw new Error('Failed to fetch notes');
      if (!commentsRes.ok) throw new Error('Failed to fetch comments');

      const activitiesData = await activitiesRes.json();
      const notesData = await notesRes.json();
      const commentsData = await commentsRes.json();

      // Extract the activities array from the response
      const activities = activitiesData.data || [];
      const notes = notesData || [];
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
    setExpandedComments(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAddComment = async (itemId, commentText) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentId: itemId,
          clientId: selectedClient._id,
          commentText,
          createdAt: new Date().toISOString(),
          author: 'Current User' // Replace with actual user name from auth context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Refresh the feed to show the new comment
      await fetchFeedData();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className={`profile-section text-xs`}>
      <NoteModal open={open} setOpen={setOpen} onSuccess={fetchFeedData} />
      <ActivityModal open={open} setOpen={setOpen} onSuccess={fetchFeedData} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Notes and Activities</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen('activity')}
            className="btn btn-sm btn-primary"
          >
            Add Activity
          </button>
          <button
            onClick={() => setOpen('note')}
            className="btn btn-sm btn-secondary"
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

      <div className="space-y-4">
        {feedItems.map((item) => (
          <div
            key={item.itemId}
            className={`p-4 rounded-lg border-l-4 ${
              item.type === 'activity'
                ? 'bg-primary/10 border-primary'
                : 'bg-secondary/10 border-secondary'
            }`}
          >
            {/* Main item content */}
            <div className="flex justify-between  text-base-content/70 mb-2">
              <span>{item.type === 'activity' ? 'Activity' : 'Note'} by {item.author}</span>
              <span>{moment(item.date).format('MMM D, YYYY h:mm A')}</span>
            </div>
            <div className="whitespace-pre-wrap break-words">
              {item.content}
            </div>
            {/*{item.type === 'activity' && item.path && (*/}
            {/*  <div className="mt-2  text-base-content/70">*/}
            {/*    <span className="font-semibold">Path: </span>*/}
            {/*    {Array.isArray(item.path) ? item.path.join(' > ') : item.path}*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Comments section */}
            <div className="mt-4 border-t border-base-300 pt-2">
              <button
                onClick={() => toggleComments(item.itemId)}
                className=" flex items-center gap-1 text-base-content/60 hover:text-base-content"
              >
                <span>{expandedComments[item.itemId] ? 'Hide' : 'Show'} comments</span>
                <span className="">({item.comments.length})</span>
              </button>

              {expandedComments[item.itemId] && (
                <div className="mt-2 space-y-2">
                  {item.comments.length > 0 ? (
                    item.comments.map((comment) => (
                      <div key={comment._id} className="pl-4 border-l-2 border-base-300 ">
                        <div className="flex justify-between  text-base-content/60">
                          <span>{comment.author}</span>
                          <span>{moment(comment.createdAt).format('MMM D, YYYY h:mm A')}</span>
                        </div>
                        <div className="mt-1">
                          {comment.commentText}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className=" text-base-content/60 italic">
                      No comments yet
                    </div>
                  )}

                  {/* Comment form */}
                  <div className="mt-3">
                    <CommentForm
                      parentId={item.itemId}
                      onAddComment={(text) => handleAddComment(item.itemId, text)}
                    />
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
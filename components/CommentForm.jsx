import React, { useState } from 'react';

const CommentForm = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText(''); // Clear input after successful submission
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-2">
      <div className="">
        <textarea
          className="textarea textarea-bordered textarea-sm  "
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={1}
        />
      </div>
      <button
        type="submit"
        className="btn btn-xs btn-primary"
        disabled={!commentText.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : 'Post'}
      </button>
    </form>
  );
};

export default CommentForm;
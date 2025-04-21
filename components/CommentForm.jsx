import React, { useState, useRef, useEffect } from 'react';

const CommentForm = ({ parentId, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Focus on the textarea when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Log for debugging
    console.log('CommentForm mounted for parentId:', parentId);
  }, [parentId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Don't submit if empty or already submitting
    if (!commentText.trim() || isSubmitting) {
      return;
    }

    console.log('Submitting comment for parentId:', parentId);
    console.log('Comment text:', commentText);

    // Set submitting state
    setIsSubmitting(true);

    // Call the parent component's handler directly
    onAddComment(commentText.trim())
      .then(() => {
        console.log('Comment submission successful');
        // Clear the input on success
        setCommentText('');
      })
      .catch(error => {
        console.error('Comment submission failed:', error);
        alert('Failed to add comment. Please try again.');
      })
      .finally(() => {
        // Reset submitting state
        setIsSubmitting(false);
      });
  };

  return (
    <form className="flex flex-col items-start gap-2">
      <div className="w-full">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered textarea-sm w-full text-sm"
          placeholder="Add a comment..."
          value={commentText}
          // onChange={(e) => setCommentText(e.target.value)}
          rows={2}
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
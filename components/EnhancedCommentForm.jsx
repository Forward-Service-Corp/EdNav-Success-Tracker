import React, { useState, useRef, useEffect } from 'react';

// Emojis in a simple array for direct access
const EMOJIS = ['😊', '😢', '😕', '😂', '👍', '👎'];

const EnhancedCommentForm = ({ parentId, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const cursorPositionRef = useRef(0);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Track cursor position when it changes
  const handleTextareaSelect = () => {
    if (textareaRef.current) {
      cursorPositionRef.current = textareaRef.current.selectionStart;
    }
  };

  // Keep focus and cursor position when comment text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();

      // Restore cursor position after text changes
      // This is crucial when adding emojis
      const pos = cursorPositionRef.current;
      textareaRef.current.selectionStart = pos;
      textareaRef.current.selectionEnd = pos;
    }
  }, [commentText]);

  // Insert emoji at cursor position
  const addEmoji = (emoji) => {
    // Get current cursor position
    const cursorPos = textareaRef.current ? textareaRef.current.selectionStart : commentText.length;
    cursorPositionRef.current = cursorPos + emoji.length;

    // Insert emoji at cursor position
    const newText =
      commentText.substring(0, cursorPos) +
      emoji +
      commentText.substring(cursorPos);

    setCommentText(newText);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddComment(commentText.trim());
      setCommentText('');
      cursorPositionRef.current = 0;

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="w-full mb-2">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full text-sm min-h-[80px]"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onSelect={handleTextareaSelect}
          onKeyUp={handleTextareaSelect}
          onMouseUp={handleTextareaSelect}
          rows={2}
        />
      </div>

      {/* Simple emoji bar - no dropdown */}
      <div className="flex items-center mb-2 gap-1">
        <span className="text-xs text-base-content/60 mr-2">Add:</span>
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="btn btn-ghost btn-xs h-8 w-8 min-h-0 p-0 flex items-center justify-center"
            onClick={() => addEmoji(emoji)}
          >
            <span className="text-xl">{emoji}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-base-content/60">
          {commentText.length} characters
        </div>

        <button
          type="submit"
          className="btn btn-successbtn-sm"
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default EnhancedCommentForm;
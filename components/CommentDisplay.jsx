import React from 'react';
import moment from 'moment';

const CommentDisplay = ({ comment }) => {
  if (!comment) return null;

  // Helper function to detect emojis in text
  const formatCommentText = (text) => {
    if (!text) return '';

    // Make text display with emojis at the proper size
    return text;
  };

  return (
    <div className="pl-4 border-l-2 border-base-300">
      <div className="flex justify-between text-base-content/60">
        <span>{comment.author}</span>
        <span>{moment(comment.createdAt).format('MMM D, YYYY h:mm A')}</span>
      </div>
      <div className="mt-1 whitespace-pre-wrap break-words text-sm">
        {formatCommentText(comment.commentText)}
      </div>
    </div>
  );
};

export default CommentDisplay;
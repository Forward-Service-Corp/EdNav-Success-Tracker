// Replace these functions in CombinedFeed.jsx

// Improved toggleComments function
function setExpandedComments() {

}

// Improved handleCommentFocus function
const handleCommentFocus = (itemId) => {
  // console.log('Comment focus requested for item:', itemId);

  // Ensure the comments section is expanded
  setExpandedComments(prev => {
    // console.log('Expanding comments for focus:', newState);
    return {
      ...prev,
      [itemId]: true // Always ensure expanded when focusing
    };
  });

  // Set active comment form with slight delay to ensure DOM is ready
  setTimeout(() => {
    // console.log('Setting active comment form to:', itemId);
    setActiveCommentForm(itemId);
  }, 10);
};

// Improved rendering of CommentForm
{
  activeCommentForm === item.itemId ? (
    <CommentForm
      key={`comment-form-${item.itemId}`} // Add key for React stability
      parentId={item.itemId}
      onAddComment={(text) => handleAddComment(item.itemId, text)}
    />
  ) : (
    <div
      className="cursor-pointer text-base-content/60 hover:text-base-content p-2 rounded border border-dashed border-base-300 text-center"
      onClick={() => handleCommentFocus(item.itemId)}
    >
      Click to add a comment...
    </div>
  );
}
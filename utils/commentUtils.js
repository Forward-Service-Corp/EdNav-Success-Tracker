// This is a utility file to help troubleshoot comment saving issues
// You can use these functions to verify comment data before saving

// Check if a value is a valid MongoDB ObjectId string
export const isValidObjectId = (id) => {
  if (!id) return false;

  // MongoDB ObjectId is a 24-character hex string
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

// Log comment data before saving
export const logCommentData = (commentData) => {
  console.group('Comment Data');
  // console.log('Parent ID:', commentData.parentId, isValidObjectId(commentData.parentId) ? '(valid ObjectId)' : '(not ObjectId format)');
  // console.log('Client ID:', commentData.clientId, isValidObjectId(commentData.clientId) ? '(valid ObjectId)' : '(not ObjectId format)');
  // console.log('Text:', commentData.commentText?.substring(0, 30) + (commentData.commentText?.length > 30 ? '...' : ''));
  // console.log('Text length:', commentData.commentText?.length || 0);
  // console.log('Author:', commentData.author);
  // console.log('Created:', commentData.createdAt);
  console.groupEnd();

  return commentData;
};

// Helper to ensure we're using the correct ID format
export const formatId = (id) => {
  if (!id) return null;
  return id.toString();
};

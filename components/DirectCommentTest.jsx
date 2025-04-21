import React, { useState } from 'react';

/**
 * A minimal, direct test component for the comment form
 * No dependencies, completely isolated
 */
const DirectCommentTest = () => {
  const [parentId, setParentId] = useState('');
  const [clientId, setClientId] = useState('');
  const [commentText, setCommentText] = useState('Test comment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parentId || !clientId || !commentText.trim()) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      // Make a direct call to the API
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentId,
          clientId,
          commentText: commentText.trim(),
          author: 'Direct Test',
          createdAt: new Date().toISOString()
        })
      });

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      // Set the result
      setResult(data);
    } catch (err) {
      console.error('Direct comment test error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border border-warning bg-warning/5 rounded-lg max-w-md mx-auto my-4">
      <h2 className="text-lg font-bold mb-4">Direct Comment Test</h2>
      <p className="text-sm mb-4">
        This is a minimal test form that directly calls the comments API without any dependencies.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Parent ID:
          </label>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="input input-bordered input-sm w-full"
            placeholder="Activity or Note ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Client ID:
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="input input-bordered input-sm w-full"
            placeholder="Client ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comment Text:
          </label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Comment text"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-warning w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : 'Submit Direct Test'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-error/10 border border-error text-error rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Result:</h3>
          <pre className="p-2 bg-base-200 rounded text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DirectCommentTest;
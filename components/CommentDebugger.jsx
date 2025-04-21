import React, { useEffect, useState } from "react";
import { useClients } from "@/contexts/ClientsContext";

/**
 * A debugging component to help troubleshoot comment-saving issues
 * You can add this temporarily to any page that needs comment debugging
 */
const CommentDebugger = () => {
  const { selectedClient } = useClients();
  const [parentId, setParentId] = useState("");
  const [commentText, setCommentText] = useState("Test comment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch comments when a client changes
  useEffect(() => {
    if (selectedClient?._id) {
      fetchComments().then();
    }
  }, [selectedClient]);

  const fetchComments = async () => {
    if (!selectedClient?._id) {
      setError("No client selected");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `/api/comments?clientId=${selectedClient._id}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message);
    }
  };

  // Handle submission through the regular comments API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient?._id) {
      setError("No client selected");
      return;
    }

    if (!parentId) {
      setError("Please enter a parent ID");
      return;
    }

    if (!commentText.trim()) {
      setError("Please enter comment text");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId,
          clientId: selectedClient._id,
          commentText,
          createdAt: new Date().toISOString(),
          author: "Debug User",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add comment");
      }

      setResult({
        ...data,
        source: "Regular API",
      });
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submission through the test endpoint
  const handleTestSubmit = async () => {
    if (!selectedClient?._id) {
      setError("No client selected");
      return;
    }

    if (!parentId) {
      setError("Please enter a parent ID");
      return;
    }

    if (!commentText.trim()) {
      setError("Please enter comment text");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/comments/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId,
          clientId: selectedClient._id,
          commentText: commentText.trim(),
          author: "Test API User",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add comment with test endpoint",
        );
      }

      setResult({
        ...data,
        source: "Test API",
      });
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment with test endpoint:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-200 border-base-300 mt-4 rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Comment Debugger</h2>

      {!selectedClient?._id ? (
        <div className="alert alert-warning mb-4">
          No client selected. Please select a client first.
        </div>
      ) : (
        <div className="mb-4">
          <p>
            <strong>Selected Client:</strong>{" "}
            {selectedClient.name ||
              `${selectedClient.first_name} ${selectedClient.last_name}`}
          </p>
          <p>
            <strong>Client ID:</strong> {selectedClient._id}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Parent ID (Activity or Note ID)</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-sm"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            placeholder="Enter activity or note ID"
          />
          <label className="label">
            <span className="label-text-alt">
              This is the MongoDB _id of the parent item
            </span>
          </label>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Comment Text</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter comment text"
            rows={2}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="btn btn-successbtn-sm"
            disabled={isSubmitting || !selectedClient?._id || !parentId}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Add Comment (Regular)"
            )}
          </button>

          <button
            type="button"
            className="btn btn-warning btn-sm"
            disabled={isSubmitting || !selectedClient?._id || !parentId}
            onClick={handleTestSubmit}
          >
            Add with Test API
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={fetchComments}
          >
            Refresh Comments
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mb-4">
          <h3 className="font-medium">Last Result ({result.source}):</h3>
          <pre className="bg-base-300 mt-2 overflow-x-auto rounded p-2 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-medium">
          Recent Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <div className="text-base-content/70 py-4 text-center">
            No comments found for this client
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Parent ID</th>
                  <th>Author</th>
                  <th>Text</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover">
                    <td className="text-xs">{comment._id}</td>
                    <td className="text-xs">{comment.parentId}</td>
                    <td>{comment.author}</td>
                    <td className="max-w-xs break-words whitespace-normal">
                      {comment.commentText?.substring(0, 30)}
                      {comment.commentText?.length > 30 ? "..." : ""}
                    </td>
                    <td className="text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentDebugger;
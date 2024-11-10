import { useState, useEffect } from "react";
import { BE_URL } from "../utils/constants";
import { SendGetRequest, SendJsonPostRequest } from "../utils/sendRequests";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BE_URL}/restaurant/comments/${localStorage.getItem(
          "id"
        )}`;
        const { responseData } = await SendGetRequest(url);
        setComments(responseData);
      } catch (error) {
        setError("Failed to fetch comments");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleReplyChange = (commentId, e) => {
    setReply({
      ...reply,
      [commentId]: e.target.value,
    });
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const url = `${BE_URL}/restaurant/comments/reply/${commentId}`;
      await SendJsonPostRequest(url, { reply: reply[commentId] });
      // Refresh comments after reply submission
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, reply: reply[commentId] }
            : comment
        )
      );
      setReply({ ...reply, [commentId]: "" });
    } catch (error) {
      setError("Failed to submit reply");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center">Loading comments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Comments</h1>
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments available.</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-center mb-2">
                <p className="font-semibold text-lg text-gray-900">
                  {comment.userName}
                </p>
              </div>
              <p className="text-gray-700 mb-2">{comment.comment}</p>
              {comment.reply ? (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="font-semibold text-sm text-gray-600">Reply:</p>
                  <p className="text-gray-700 mt-1">{comment.reply}</p>
                </div>
              ) : (
                <div className="mt-4">
                  <textarea
                    value={reply[comment._id] || ""}
                    onChange={(e) => handleReplyChange(comment._id, e)}
                    placeholder="Add a reply"
                    className="border p-3 rounded-md w-full min-h-[100px] resize-none"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Submit Reply
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comment;

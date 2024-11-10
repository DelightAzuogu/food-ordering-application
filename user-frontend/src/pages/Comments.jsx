import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BE_URL } from "../utils/constants";

const Comment = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch restaurant comments
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`${BE_URL}/restaurant/comments/${id}`);
        setComments(data);
      } catch (err) {
        setError("Failed to fetch comments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-500">Loading comments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Comments
      </h1>
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments available.</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-semibold">
                  {comment.userName.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg text-gray-900">
                    {comment.userName}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{comment.comment}</p>
              {comment.reply ? (
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <p className="font-semibold text-sm text-gray-600">Reply:</p>
                  <p className="text-gray-700 mt-1">{comment.reply}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">No reply</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comment;

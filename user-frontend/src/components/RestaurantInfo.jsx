import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const RestaurantInfo = ({ restaurant, onRate, postComment }) => {
  const { name, location, status, rating } = restaurant;
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRateChange = (e) => {
    setUserRating(parseInt(e.target.value));
  };

  const handleRateSubmit = () => {
    if (onRate && userRating >= 0 && userRating <= 10) {
      onRate(restaurant._id, userRating);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (postComment && comment.trim()) {
      postComment(restaurant._id, comment);
      setComment(""); // Clear the input field after submission
    }
  };

  return (
    <div className="flex flex-col pb-4 border-b border-dashed">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-xl font-bold my-2">{name}</h2>
            <div className="flex items-center ml-2">
              <StarIcon className="w-5 h-5 text-yellow-500" />
              <span className="ml-1 text-lg font-semibold text-zinc-800">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500">{status}</p>
          <p className="text-xs text-gray-500">
            {location.address}, {location.city}
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <select
              value={userRating}
              onChange={handleRateChange}
              className="border p-1 rounded-md"
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <button
              onClick={handleRateSubmit}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md"
            >
              Rate
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
          className="border p-2 rounded-md w-full"
        />
        <button
          onClick={handleCommentSubmit}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md"
        >
          Submit Comment
        </button>
      </div>

      <Link to={`/comment/${restaurant._id}`}>
        <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md">
          View Comments
        </button>
      </Link>
    </div>
  );
};

export default RestaurantInfo;

import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { BE_URL, CDN_URL } from "../utils/constants";
import { useState } from "react";

const RestaurantCard = ({ restaurant }) => {
  function isURL(str) {
    const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[\w\-\.\+]+\.\w+(?:\/.*)?$/;
    return urlRegex.test(str);
  }

  var image = isURL(restaurant.imageUrl)
    ? restaurant.imageUrl
    : `${BE_URL}/restaurant/image/${restaurant._id}`;

  return (
    <>
      <div className="overlay-container">
        <img
          src={image}
          alt={restaurant.imageUrl}
          className="relative w-full min-h-[180px] overflow-hidden aspect-video object-cover block rounded-md"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <h2 className="text-lg font-semibold text-zinc-800">
          {restaurant.name}
        </h2>
        <div className="flex items-center">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="ml-1 text-lg font-semibold text-zinc-800">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;

import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { CDN_URL } from "../utils/constants";

const RestaurantCard = ({ restaurant }) => {
  return (
    <>
      {/* //for the image  */}
      <div className="overlay-container">
        <img
          src={restaurant?.imageUrl}
          alt="restaurant"
          className="relative w-full min-h-[180px] overflow-hidden aspect-video object-cover block rounded-md"
        />
      </div>

      {/* for the name of the restaurant  */}
      <h2 className="text-lg font-semibold mt-2 text-zinc-800">
        {restaurant?.name}
      </h2>

      {/* <p className="truncate  text-zinc-600">
        {info?.cuisines?.map((c, i) => (
          <span key={i}>
            {c}
            {i === info.cuisines.length - 1 ? "" : ", "}
          </span>
        ))}
      </p> */}

      {/* <p className="text-zinc-600">{info?.locality}</p> */}
    </>
  );
};

export default RestaurantCard;

//  HOC for Top Rated Restaurants
export const withTopRatedLabel = (RestaurantCard) => {
  return (props) => {
    return (
      <div className="relative">
        <p className="absolute z-10 -top-2 -left-2 rounded-md p-2 px-4 bg-zinc-900 text-white text-xs">
          Top Rated
        </p>
        <RestaurantCard {...props} />
      </div>
    );
  };
};

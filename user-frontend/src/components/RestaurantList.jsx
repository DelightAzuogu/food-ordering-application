import { Link } from "react-router-dom";
import RestaurantCard, { withTopRatedLabel } from "./RestaurantCard";

const RestaurantList = ({ restaurants }) => {
  return (
    <div className="container-max">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {restaurants && restaurants?.length !== 0 ? (
          restaurants.map((restaurant, i) => (
            <Link
              to={`/restaurants/${restaurant._id}`}
              className="hover:scale-95 transition ease-in-out duration-300 relative z-10"
              key={i}
            >
              <RestaurantCard restaurant={restaurant} />
            </Link>
          ))
        ) : (
          <p>No restaurant found!</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;

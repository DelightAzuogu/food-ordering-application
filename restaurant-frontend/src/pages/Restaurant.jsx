import { useParams } from "react-router-dom";

import RestaurantInfo from "../components/RestaurantInfo";
import ShimmerRestaurant from "../components/shimmers/ShimmerRestaurant";
import RestaurantMenu from "../components/RestaurantMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { BE_URL } from "../utils/constants";

const Restaurant = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    //get restaurant
    (async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(`${BE_URL}/restaurant/${id}`);

        setRestaurant(data.restaurant);
        setMenu(data.menu);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container-md my-8">
      {isLoading ? (
        <ShimmerRestaurant />
      ) : (
        <>
          <RestaurantInfo restaurant={restaurant} />
          <RestaurantMenu menu={menu} />
        </>
      )}
    </div>
  );
};
export default Restaurant;

import React, { useState, useEffect } from "react";
import RestaurantList from "../components/RestaurantList";
import { BE_URL } from "../utils/constants";

const Restaurants = (props) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    //getting the list of restaurants
    async function getRestaurants() {
      try {
        const response = await fetch(`${BE_URL}/restaurant/`, {
          method: "GET",
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw responseData;
        }

        setRestaurants(responseData.restaurants);
      } catch (error) {
        console.error(error);
      }
    }

    getRestaurants();
  }, []);

  return (
    <div className="bg-white relative py-8">
      <RestaurantList restaurants={restaurants} />
    </div>
  );
};

export default Restaurants;

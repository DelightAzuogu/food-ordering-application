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

  function onRate(restaurantId, userRating) {
    try {
      const url = `${BE_URL}/user/add-rating/${restaurantId}/${userRating}`;

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.err(err);
    }
  }

  function postComment(restaurantId, comment) {
    try {
      const url = `${BE_URL}/user/add-comment/${restaurantId}`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({ comment });

      fetch(url, {
        method: "POST",
        headers,
        body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container-md my-8">
      {isLoading ? (
        <ShimmerRestaurant />
      ) : (
        <>
          <RestaurantInfo
            restaurant={restaurant}
            onRate={onRate}
            postComment={postComment}
          />
          <RestaurantMenu menu={menu} />
        </>
      )}
    </div>
  );
};
export default Restaurant;

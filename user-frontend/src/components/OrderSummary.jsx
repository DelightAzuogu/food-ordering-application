import { useEffect, useState } from "react";
import Location from "./Location";
import { BE_URL } from "../utils/constants";
import { SendPostRequest } from "../utils/sendRequests";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ totalPrice, itemsCount }) => {
  const [location, setLocation] = useState();
  const [showLocation, setShowLocation] = useState(false);
  const [error, setError] = useState();

  const navigate = useNavigate();

  function handleLocation() {
    setShowLocation(true);
  }

  function closeLocation(location) {
    setLocation(location);
    setShowLocation(false);
    setError(undefined);
  }

  async function handleOrder(e) {
    e.preventDefault();

    if (!location) {
      setError("select a location");
      return;
    }

    const url = `${BE_URL}/order/${location._id}`;

    navigate("/order");

    try {
      const { responseData } = await SendPostRequest(url);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="basis-5/12 h-fit sticky top-40 p-8 rounded-md border shadow-md my-8 md:m-0">
      <h2 className="text-xl font-bold border-b pb-4">Order Summary</h2>
      <div className="py-4 text-lg space-y-4 border-b">
        <div className="flex justify-between items-center font-semibold">
          <p className="font-normal">Price {itemsCount} items)</p>
          <p>{totalPrice}</p>
        </div>
      </div>

      <button
        className="w-full block mt-4 uppercase font-bold text-lg bg-orange-600 text-white text-center p-4 rounded-md transition duration-300 hover:bg-orange-700"
        onClick={handleLocation}
      >
        Select Location
      </button>

      {error && (
        <div className="flex justify-between items-center font-semibold">
          <p>{error}</p>
        </div>
      )}

      {location && (
        <div className="flex justify-between items-center font-semibold">
          <p>
            {location.address},{location.city}
          </p>
        </div>
      )}

      <div className="py-4 border-b">
        <div className="md:flex justify-between items-center font-bold text-lg md:text-2xl">
          <p>You will get your order within the hour :)</p>
        </div>
      </div>

      <button
        className="w-full block mt-4 uppercase font-bold text-lg bg-orange-600 text-white text-center p-4 rounded-md transition duration-300 hover:bg-orange-700"
        onClick={(e) => handleOrder(e)}
      >
        Place order
      </button>

      {showLocation && (
        <Location onClose={closeLocation} message={"Select Location"} />
      )}
    </div>
  );
};

export default OrderSummary;

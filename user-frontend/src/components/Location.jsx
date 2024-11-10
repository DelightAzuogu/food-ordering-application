import React, { useEffect, useState } from "react";
import { BE_URL } from "../utils/constants";
import { SendGetRequest, SendPostRequest } from "../utils/sendRequests";

function Location({ message, onClose }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);

  async function GetLocations() {
    try {
      const url = `${BE_URL}/user/get-locations`;

      const { responseData } = await SendGetRequest(url);

      setLocations(responseData.locations);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetLocations();
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleAddLocationClick = () => {
    setShowAddLocationForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const address = e.target[0].value;
    const city = e.target[1].value;

    try {
      const url = `${BE_URL}/user/add-location`;

      const body = { address, city };

      const { responseData } = await SendPostRequest(url, body);

      setLocations(responseData.locations);
    } catch (error) {
      console.error(error);
    }

    setShowAddLocationForm(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <p className="text-lg mb-4">{message}</p>

        <ul>
          {locations.map((location, index) => (
            <li key={index} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  checked={selectedLocation === location}
                  onChange={() => handleLocationChange(location)}
                  className="form-radio h-5 w-5 text-orange-500"
                />
                <span className="ml-2">
                  {location.address}, {location.city}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAddLocationClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
        >
          + Add Location
        </button>

        {/* Add Location Form */}
        {showAddLocationForm && (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-2">
              <label htmlFor="address" className="block">
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="city" className="block">
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        )}

        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              onClose(selectedLocation);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Location;

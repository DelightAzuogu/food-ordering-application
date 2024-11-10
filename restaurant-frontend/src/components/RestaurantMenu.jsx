import { useState } from "react";
import { BE_URL } from "../utils/constants";
import { SendJsonPostRequest } from "../utils/sendRequests";
import CustomAlert from "./CustomAlert";

const RestaurantMenu = ({ menu }) => {
  const [showAlert, setShowAlert] = useState(false);

  function handleAlert() {
    setShowAlert(true);
  }

  function closeAlert() {
    setShowAlert(false);
  }

  async function onSubmitAddToCart(e, itemId) {
    e.preventDefault();
    const quantity = e.target[0].value;

    try {
      const url = `${BE_URL}/cart/add-to-cart/${itemId}`;

      const body = {
        quantity,
      };

      const { responseData } = await SendJsonPostRequest(url, body);

      if (responseData.msg.toLowerCase() == "added") {
        handleAlert();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="">
      <ul className="">
        {menu?.map((item, i) => (
          <li
            className="p-2 py-8 flex gap-4 md:gap-8 justify-between items-center border-b"
            key={i}
          >
            <div className="basis-8/12 space-y-2">
              <h2 className="text-base font-semibold">{item?.name}</h2>
              <p className="text-xs font-semibold">${item.price}</p>
              <p className="text-xs hidden md:block">{item?.description}</p>

              <div className="flex items-center">
                <form
                  onSubmit={(e) => {
                    onSubmitAddToCart(e, item._id);
                  }}
                >
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-16 p-2 text-center border border-gray-300 rounded-md"
                  />
                  <button
                    type="submit"
                    className="bg-white text-orange-500 hover:bg-orange-500 hover:text-white font-bold p-2 px-6 rounded-md ml-4"
                  >
                    ADD
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full basis-4/12 relative">
              <img
                className="w-full h-32 aspect-video object-cover rounded-md"
                src={item?.imageUrl}
                alt="image for menu item"
              />
            </div>
          </li>
        ))}
      </ul>
      {showAlert && (
        <CustomAlert message="Added item to cart" onClose={closeAlert} />
      )}
    </div>
  );
};

export default RestaurantMenu;

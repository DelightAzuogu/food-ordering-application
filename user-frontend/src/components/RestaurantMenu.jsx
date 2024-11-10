import { useState } from "react";
import { BE_URL } from "../utils/constants";
import { SendPostRequest } from "../utils/sendRequests";
import CustomAlert from "./CustomAlert";

const RestaurantMenu = ({ menu }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [addMessage, setAddMessage] = useState("added to cart");

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

      const { responseData } = await SendPostRequest(url, body);

      if (responseData.msg.toLowerCase() == "added") {
        setAddMessage("Added to cart");
        handleAlert();
      }
    } catch (error) {
      setAddMessage("an error occurred");
      handleAlert();
      console.error(error);
    }
  }

  return (
    <div className="">
      <ul className="">
        {menu?.map((item, i) => {
          function isURL(str) {
            const urlRegex =
              /^(?:https?:\/\/)?(?:www\.)?[\w\-\.\+]+\.\w+(?:\/.*)?$/;
            return urlRegex.test(str);
          }

          var image = isURL(item.imageUrl)
            ? item.imageUrl
            : `${BE_URL}/menu/image/${item._doc._id}`;

          return (
            <li
              className="p-2 py-8 flex gap-4 md:gap-8 justify-between items-center border-b"
              key={i}
            >
              <div className="basis-8/12 space-y-2">
                <h2 className="text-base font-semibold">{item._doc.name}</h2>
                <p className="text-xs font-semibold">${item._doc.price}</p>
                <p className="text-xs hidden md:block">
                  {item._doc.description}
                </p>

                <div className="flex items-center">
                  <form
                    onSubmit={(e) => {
                      onSubmitAddToCart(e, item._doc._id);
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
                  src={image}
                  alt="image for menu item"
                />
              </div>
            </li>
          );
        })}
      </ul>
      {showAlert && <CustomAlert message={addMessage} onClose={closeAlert} />}
    </div>
  );
};

export default RestaurantMenu;

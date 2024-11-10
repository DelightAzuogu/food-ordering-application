import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { CDN_URL } from "../utils/constants";
import { useState } from "react";

const RestaurantMenuItem = ({ items, index, activeIndex, setActiveIndex }) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (item) => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(item));
    }
    toast.success("Added to cart!");
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <ul className="p-4">
        {items?.card?.card?.itemCards?.map((item, i) => {
          const itemPrice =
            item?.card?.info?.price || item?.card?.info?.defaultPrice;

          return (
            <li
              className="p-2 py-8 flex gap-4 md:gap-8 justify-between items-center border-b"
              key={i}
            >
              <div className="basis-8/12 space-y-2">
                <h2 className="text-base font-semibold">
                  {item?.card?.info?.name}
                </h2>
                <p className="text-xs font-semibold">₹{itemPrice / 100}</p>
                <p className="text-xs hidden md:block">
                  {item?.card?.info?.description}
                </p>

                <div className="flex items-center">
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 p-2 text-center border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleAddToCart({ ...item, itemPrice })}
                    className="bg-white text-orange-500 hover:bg-orange-500 hover:text-white font-bold p-2 px-6 rounded-md ml-4"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div className="w-full basis-4/12 relative">
                <img
                  className="w-full h-32 aspect-video object-cover rounded-md"
                  src={CDN_URL + item?.card?.info?.imageId}
                  alt=""
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default RestaurantMenuItem;

import { BE_URL } from "../utils/constants";
import { SendJsonPostRequest } from "../utils/sendRequests";

const CartItemList = ({ cartItems, GetCartItems }) => {
  const removeItem = async (e, id) => {
    e.preventDefault();

    const url = `${BE_URL}/cart/remove-item-from-cart/${id}`;

    try {
      await SendJsonPostRequest(url);

      GetCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (e, id) => {
    e.preventDefault();

    const url = `${BE_URL}/cart/decrease-quantity-by-1/${id}`;

    try {
      const { responseData } = await SendJsonPostRequest(url);

      GetCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  const increaseQuantity = async (e, id) => {
    e.preventDefault();

    const url = `${BE_URL}/cart/increase-quantity-by-1/${id}`;

    try {
      const { responseData } = await SendJsonPostRequest(url);

      GetCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex grow min-h-[60vh] justify-center items-center">
        <p>Your cart is empty!</p>
      </div>
    );
  }

  return (
    <ul className="basis-7/12">
      {cartItems &&
        cartItems.map((cartItem, i) => (
          <li key={i} className="flex gap-4 justify-between max-w-[600px] my-4">
            <div className="basis-3/12">
              <img
                className="w-full h-full md:h-auto object-cover block rounded-md aspect-square"
                src={cartItem?.item.imageUrl}
                alt="item image"
              />
            </div>
            <div className="basis-9/12">
              <p className="text-lg font-semibold">{cartItem?.item?.name}</p>

              <p className="md:block">
                {cartItem?.item?.description?.length > 50
                  ? cartItem?.item?.description.slice(0, 50) + "..."
                  : cartItem?.item?.description}
              </p>

              <p className="my-2 space-x-1">
                <span className="font-semibold">
                  $
                  {parseFloat(
                    (
                      cartItem?.quantity * parseFloat(cartItem?.item?.price)
                    ).toFixed(2)
                  )}
                </span>
                <span className="text-gray-800 font-normal">
                  ({cartItem?.item?.price} × {cartItem?.quantity})
                </span>
              </p>

              {/* actions */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <button
                    onClick={(e) => decreaseQuantity(e, cartItem?.item?._id)}
                    disabled={cartItem?.quantity === 1}
                    className={
                      "bg-orange-500 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-bold w-8 h-8 rounded-md"
                    }
                  >
                    -
                  </button>
                  <p className="font-bold w-8 h-8 flex justify-center items-center">
                    {cartItem?.quantity}
                  </p>
                  <button
                    onClick={(e) => increaseQuantity(e, cartItem?.item?._id)}
                    className="bg-orange-500 text-white font-bold w-8 h-8 rounded-md"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={(e) => removeItem(e, cartItem?.item?._id)}
                  className="border border-orange-500 text-xs font-semibold text-orange-500 p-2 px-4 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CartItemList;

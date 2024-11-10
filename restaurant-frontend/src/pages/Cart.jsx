import { useEffect, useState } from "react";
import CartItemList from "../components/CartItemList";
import OrderSummary from "../components/OrderSummary";
import { BE_URL } from "../utils/constants";
import { SendGetRequest } from "../utils/sendRequests";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);

  async function GetCartItems() {
    try {
      const url = `${BE_URL}/cart/`;

      const { responseData } = await SendGetRequest(url);

      setCartItems(responseData.cartItems);

      setTotalPrice(responseData.totalPrice);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetCartItems();
  }, []);

  return (
    <div className="container-max py-8 pb-16">
      <h1 className="text-2xl my-4 font-semibold">Cart</h1>

      {/* cart details */}
      <div className="min-h-[60vh] pb-8 md:flex gap-8">
        {/* cart items */}
        <CartItemList cartItems={cartItems} GetCartItems={GetCartItems} />
        {/* order summary */}
        {cartItems && cartItems.length !== 0 && (
          <OrderSummary itemsCount={cartItems.length} totalPrice={totalPrice} />
        )}
      </div>
    </div>
  );
};

export default Cart;

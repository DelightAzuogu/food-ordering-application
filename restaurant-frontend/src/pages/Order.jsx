import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BE_URL } from "../utils/constants";
import { SendGetRequest, SendJsonPostRequest } from "../utils/sendRequests";

function Order(props) {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BE_URL}/order/restaurant`;
        const { responseData } = await SendGetRequest(url);
        setOrders(responseData.orders);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleOrderStatusChange = async (status, orderId) => {
    try {
      const url = `${BE_URL}/order/change-status/${orderId}/${status}`;
      await SendJsonPostRequest(url);
    } catch (error) {
      console.error(error);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return orders.length === 0 ? (
    <div className="flex items-center justify-center h-screen">
      <div className="text-4xl">No Orders</div>
    </div>
  ) : (
    <div className="container mx-auto mt-5">
      {orders.map((order, index) => {
        const date = new Date(order.Date);

        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };

        const formattedDate = date
          .toLocaleDateString("en-US", options)
          .replace(/\//g, "-");

        return (
          <div key={index} className="mb-4 border p-4 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">
              Date: {formattedDate}
            </h2>
            <h2 className="text-2xl font-semibold mb-2">
              Location: {order.location.address}, {order.location.city}
            </h2>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.items.map((item, i) => {
                function isURL(str) {
                  const urlRegex =
                    /^(?:https?:\/\/)?(?:www\.)?[\w\-\.\+]+\.\w+(?:\/.*)?$/;
                  return urlRegex.test(str);
                }

                var image = isURL(item.item.imageUrl)
                  ? item.item.imageUrl
                  : `${BE_URL}/menu/image/${item.item._doc._id}`;

                return (
                  <div key={i} className="p-2 border rounded-lg cursor-pointer">
                    <div className="h-36 overflow-hidden">
                      <img
                        src={image}
                        alt={item._doc.item.name}
                        className="w-full h-full  object-cover"
                        onClick={() => openImageModal(item.item.imageUrl)}
                      />
                    </div>
                    <p className="font-bold text-xl">{item._doc.item.name}</p>
                    <p
                      className={
                        item._doc.status.includes("accepted")
                          ? "text-green-500"
                          : item._doc.status.includes("declined")
                          ? "text-red-500"
                          : "text-gray-500"
                      }
                    >
                      {item._doc.status}
                    </p>
                    <p>{item._doc.quantity} pieces</p>
                    <p>${item._doc.price.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            {/* Buttons for order status actions */}
            {order.items.some((item) => item._doc.status === "pending") && (
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleOrderStatusChange("accepted", order._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => handleOrderStatusChange("declined", order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Decline Order
                </button>
              </div>
            )}
            {order.items.every((item) => item._doc.status === "accepted") && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    handleOrderStatusChange("delivered", order._id)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Mark Order Delivered
                </button>
              </div>
            )}
          </div>
        );
      })}

      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75"
          onClick={closeImageModal}
        >
          <div className="relative bg-white">
            <img
              src={selectedImage}
              alt="Full-screen"
              className="max-h-screen mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;

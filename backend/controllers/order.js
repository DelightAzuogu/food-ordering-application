const { Cart } = require("../model/cart");
const { Order } = require("../model/order");
const { Restaurant } = require("../model/restaurant");
const { User } = require("../model/user");
const newError = require("../util/error");
const fs = require("fs");

//order items in cart
exports.postOrderAll = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw newError("user Id not found", 404);
    }

    const userLocationId = req.params.locationId;
    if (!userLocationId) {
      throw newError("Location Id not found", 404);
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw newError("user not found", 404);
    }

    let userCart = await Cart.findOne({ userId }).populate("items.item");
    if (!userCart) {
      throw newError("cart not found", 404);
    }

    const location = user.location.find((l) => l._id == userLocationId);
    if (!location) {
      throw newError("location not found", 404);
    }

    const orderItems = userCart.items.map((i) => {
      let price = i.quantity * i.item.price;
      return {
        price,
        quantity: i.quantity,
        item: i.item,
        status: "pending",
        restaurant: i.item.restaurant,
      };
    });

    // TODO: add socket.io here to emit to the restaurant that a new other is placed to that restaurant

    let order = new Order({
      location,
      user: userId,
      items: orderItems,
    });

    order = order.save();

    userCart.deleteOne();

    return res.status(200).json({ msg: "ordered" });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userOrders = await Order.find({ user: user._id })
      .populate("items.item")
      .populate("items.restaurant");

    let ordersWithoutUser = userOrders.map((order) => {
      const { user, ...orderWithoutUser } = order.toObject();
      return orderWithoutUser;
    });

    ordersWithoutUser = ordersWithoutUser.map((o) => {
      return {
        ...o,
        items: o.items.map((i) => {
          return {
            ...i,
            item: {
              ...i.item,
              imageUrl: isURL(i.item.imageUrl)
                ? i.item.imageUrl
                : fs.readFileSync(i.item.imageUrl, { encoding: "base64" }),
            },
          };
        }),
      };
    });

    return res.status(200).json({ orders: ordersWithoutUser });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantOrders = async (req, res, next) => {
  const restaurantId = req.restId;

  const restaurant = await Restaurant.findOne({ _id: restaurantId });

  if (!restaurant) {
    throw newError("Restaurant not found", 404);
  }

  const restaurantOrders = await Order.find({
    "items.restaurant": restaurantId,
  }).populate({
    path: "items.item",
    model: "MenuItem", // Replace 'MenuItem' with the name of your MenuItem model
  });

  let filteredOrders = restaurantOrders.map((order) => ({
    ...order._doc,
    items: order.items.filter(
      (item) => item.restaurant.toString() === restaurantId
    ),
  }));

  filteredOrders = filteredOrders.map((o) => {
    return {
      ...o,
      items: o.items.map((i) => {
        return {
          ...i,
          item: {
            ...i.item,
            imageUrl: isURL(i.item.imageUrl)
              ? i.item.imageUrl
              : fs.readFileSync(i.item.imageUrl, { encoding: "base64" }),
          },
        };
      }),
    };
  });

  return res.status(200).json({ orders: filteredOrders });
};

exports.postChangeOrderStatus = async (req, res, next) => {
  const restaurantId = req.restId;
  const orderId = req.params.orderId;
  const status = req.params.status;

  try {
    if (
      status !== "accepted" &&
      status !== "declined" &&
      status !== "delivered"
    ) {
      throw new Error("Invalid status");
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new Error("Order not found");
    }

    // Update only the items belonging to the specified restaurant
    order.items = order.items.map((item) => {
      if (item.restaurant.toString() === restaurantId) {
        return { ...item, status: status };
      }
      return item;
    });

    await order.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

function isURL(str) {
  try {
    new URL(str);
    return true; // Valid URL
  } catch (error) {
    return false; // Not a URL
  }
}

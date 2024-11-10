const express = require("express");

const userAuth = require("../util/user-auth");
const orderController = require("../controllers/order");
const restAuth = require("../util/rest-Auth");

const router = express.Router();

//order items in cart
router.post("/:locationId", userAuth, orderController.postOrderAll);

//Get user orders
router.get("/user", userAuth, orderController.getUserOrders);

//Get restaurant Orders
router.get("/restaurant", restAuth, orderController.getRestaurantOrders);

router.post(
  "/change-status/:orderId/:status",
  restAuth,
  orderController.postChangeOrderStatus
);

module.exports = router;

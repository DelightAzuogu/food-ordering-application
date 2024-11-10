const express = require("express");
const { body } = require("express-validator");

const userAuth = require("../util/user-auth");
const cartController = require("../controllers/cart");

const router = express.Router();

//add item
router.post(
  "/add-to-cart/:itemId",
  [body("quantity").isInt({ gt: 0 }).trim()],
  userAuth,
  cartController.postAddToCart
);

//increase quanity by one
router.post(
  "/increase-quantity-by-1/:itemId",
  userAuth,
  cartController.postIncreaseQuantityByOne
);

//decrease the quantity  by one
router.post(
  "/decrease-quantity-by-1/:itemId",
  userAuth,
  cartController.postDecreaseQuantityByOne
);

//delete an item from the cart
router.post(
  "/remove-item-from-cart/:itemId",
  userAuth,
  cartController.postCartItem
);

//get cart
router.get("/", userAuth, cartController.getCart);

module.exports = router;

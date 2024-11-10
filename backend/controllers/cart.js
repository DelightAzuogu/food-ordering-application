const { Cart } = require("../model/cart");
const newError = require("../util/error");
const ValErrorCheck = require("../util/validationError");
const { menuItemCheck } = require("../util/menu-item-check");
const fs = require("fs");
const path = require("path");

//add to cart
exports.postAddToCart = async (req, res, next) => {
  try {
    const valErr = ValErrorCheck(req);
    if (valErr) {
      throw valErr;
    }

    const itemId = req.params.itemId;
    const quantity = Number(req.body.quantity);

    //check for the menu item
    const menuItem = await menuItemCheck(itemId);

    //check for cart item
    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (cart) {
      //checking if the item is already in the cart
      if (cart.items.some((value) => value.item == itemId)) {
        //increasing the quantity if in cart already
        cart.items = cart.items.map((cartItem) => {
          if (cartItem.item == itemId) {
            var itemQuantity = cartItem.quantity + quantity;

            const updatedItem = {
              quantity: itemQuantity,
              item: menuItem._id,
            };

            return updatedItem;
          } else {
            return cartItem;
          }
        });

        await cart.save();

        res.status(201).json({ msg: "Added" });
      } else {
        //pushin the item to cart if it wasnt there
        cart.items.push({
          item: menuItem._id,
          quantity,
        });

        cart.save();

        res.status(201).json({ msg: "Added" });
      }
    } else {
      //when the user does not have a cart
      Cart.create({
        userId: req.userId,
        items: [
          {
            item: menuItem._id,
            quantity,
          },
        ],
      });
      res.status(201).json({ msg: "Added" });
    }
  } catch (err) {
    next(err);
  }
};

//increase quantity by one
exports.postIncreaseQuantityByOne = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;

    // Check for item in the menu
    const menuItem = await menuItemCheck(itemId);

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      throw newError("cart not found", 404);
    }

    const cartItem = cart.items.find((item) => item.item.equals(itemId));

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      throw newError("Item not found in cart", 404);
    }

    // Save the updated cart
    await cart.save();

    res.status(201).json({ msg: "increased" });
  } catch (err) {
    next(err);
  }
};

//decrease quantity by one
exports.postDecreaseQuantityByOne = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;

    const menuItem = await menuItemCheck(itemId);

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      throw newError("cart not found", 404);
    }

    const cartItem = cart.items.find((item) => item.item.equals(itemId));

    if (cartItem) {
      cartItem.quantity -= 1;

      if (cartItem.quantity === 0) {
        cart.items = cart.items.filter((item) => !item.item.equals(itemId));
      }

      await cart.save();

      return res.status(200).json({ msg: "decreased" });
    } else {
      throw newError("Item not found in cart", 404);
    }
  } catch (err) {
    next(err);
  }
};

//delete item from a users cart
exports.postCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      throw newError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex((item) => item.item.equals(itemId));

    if (itemIndex === -1) {
      throw ("Item not found in cart", 404);
    }

    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      await cart.remove();
      return res
        .status(200)
        .json({ msg: "Item removed, and cart is now empty" });
    }

    await cart.save();

    res.status(200).json({ msg: "Item removed from cart" });
  } catch (err) {
    next(err);
  }
};

//get the items in a users cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId })
      .lean()
      .populate("items.item");

    if (!cart) {
      res.status(200).json({
        msg: "cart items",
        cartItems: [],
        totalPrice: 0,
      });
      return;
    }

    let totalPrice = 0;
    cart?.items?.forEach(({ quantity, item }) => {
      totalPrice = quantity * item.price;
    });

    cart.items = cart.items.map((i) => ({
      ...i,
      item: {
        ...i.item,
        imageUrl: isURL(i.item.imageUrl)
          ? i.item.imageUrl
          : fs.readFileSync(i.item.imageUrl, { encoding: "base64" }),
      },
    }));

    res.status(200).json({
      msg: "cart items",
      cartItems: cart.items,
      totalPrice,
    });
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

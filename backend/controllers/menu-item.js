const { Readable } = require("stream");
require("dotenv").config();
const validationError = require("../util/validationError");
const { MenuItem } = require("../model/menu-item");
const { Restaurant } = require("../model/restaurant");
const fs = require("fs");
const path = require("path");
const {
  googleDriveDelete,
  googleDriveGetLink,
  googleDriveUpload,
} = require("../util/google-drive");
const { Cart } = require("../model/cart");
const newError = require("../util/error");
const { ObjectId } = require("mongodb");

const defaultImage =
  "https://lh3.google.com/u/1/d/1g10iaTr6yfjK3JBr428YvUZfWq_ctyuZ=w1366-h668-iv1";

//ADD menu item
exports.putAddItem = async (req, res, next) => {
  try {
    const err = validationError(req);
    if (err) throw err;

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;

    let imageId = "";
    let imageUrl = defaultImage;

    if (req.file) {
      //   //converting the img buffer to a readable stream
      //   const stream = Readable.from(req.file.buffer);
      //   //uploading the img to google drive
      //   const uploadImg = await googleDriveUpload(req, stream);
      //   if (uploadImg instanceof Error) {
      //     throw uploadImg;
      //   }

      //   imageId = uploadImg.data.id;

      //   // get the img link
      //   const imgLink = await googleDriveGetLink(uploadImg.data.id);

      //   if (imgLink instanceof Error) {
      //     //delete the img if eerror
      //     const deleteImg = googleDriveDelete(imageId);
      //     if (deleteImg instanceof Error) {
      //       throw deleteImg;
      //     }
      //     throw imgLink;
      //   }
      //   imageUrl = imgLink.data.webViewLink;
      const relativeFilePath = req.file.path;
      const rootDirectory = path.resolve(__dirname, "../");
      imageUrl = path.resolve(rootDirectory, path.resolve(relativeFilePath));
    }

    const menuItem = await MenuItem.create({
      name,
      price,
      description,
      imageUrl,
      imageId: imageId == "" ? null : imageId,
      restaurant: req.rest_Id,
    });

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
};

//edit ITEM
exports.postEditMenuItem = async (req, res, next) => {
  try {
    //validation error
    const err = validationError(req);
    if (err) next(err);

    const itemId = req.params.id;

    let menuItem = await MenuItem.findOne({ _id: itemId });

    let imageId = menuItem.imageId;
    let imageUrl = menuItem.imageUrl;

    if (req.file) {
      //   //check if the img was changed
      //   //upload the new img and delete the old img
      //   //change the img links
      //   const stream = Readable.from(req.file.buffer);

      //   const uploadImg = await googleDriveUpload(req, stream);
      //   if (uploadImg instanceof Error) {
      //     throw uploadImg;
      //   }

      //   //updating the img in drive
      //   const imgLink = await googleDriveGetLink(uploadImg.data.id);

      //   if (imgLink instanceof Error) {
      //     const deleteImg = googleDriveDelete(uploadImg.data.id);
      //     if (deleteImg instanceof Error) {
      //       throw deleteImg;
      //     }
      //     throw imgLink;
      //   }

      //   const deleteImg = googleDriveDelete(imageId);
      //   if (deleteImg instanceof Error) {
      //     throw deleteImg;
      //   }
      //   imageId = uploadImg.data.id;
      //   imageUrl = imgLink.data.webViewLink;
      const relativeFilePath = req.file.path;
      const rootDirectory = path.resolve(__dirname, "../");
      imageUrl = path.resolve(rootDirectory, path.resolve(relativeFilePath));
    }

    //update the menuitem
    menuItem.name = req.body.name;
    menuItem.description = req.body.description;
    menuItem.price = req.body.price;
    menuItem.imageUrl = imageUrl;
    menuItem.imageId = imageId;

    menuItem = await menuItem.save();

    res.status(201).json({
      msg: "updated",
    });
  } catch (err) {
    next(err);
  }
};

//DELETE ITEM
exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;

    const menuItem = await MenuItem.findOneAndDelete({ _id: ObjectId(itemId) });
    if (!menuItem) {
      throw newError("item not found", 400);
    }

    // Delete the image from Google Drive
    // const deleteImg = googleDriveDelete(menuItem.imageId);
    // if (deleteImg instanceof Error) {
    //   throw deleteImg;
    // }

    const cartItems = await Cart.find({
      "items.item": itemId,
    });

    if (cartItems.length > 0) {
      for (const cartItem of cartItems) {
        const cart = await Cart.findByIdAndUpdate(cartItem._id, {
          $pull: { items: { item: itemId } },
        });
      }
    }

    res.status(200).json({ msg: "deleted" });
  } catch (err) {
    next(err);
  }
};

//Get MenuItem
exports.getRestaurantMenuItems = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) throw newError("invalid restaurant");

    let menuItems = await MenuItem.find({ restaurant: restaurant._id });

    menuItems = menuItems.map((m) => ({
      ...m,
      imageUrl: isURL(m.imageUrl)
        ? m.imageUrl
        : fs.readFileSync(m.imageUrl, { encoding: "base64" }),
    }));

    res.status(200).json({ menuItems });
  } catch (err) {
    next(err);
  }
};

exports.getMenuItemImage = async (req, res, next) => {
  try {
    const menuId = req.params.menuId;

    const menu = await MenuItem.findOne({ _id: menuId });
    if (!menu) {
      throw newError("menu not found", 404);
    }

    fs.readFile(menu.imageUrl, (err, data) => {
      if (err) {
        throw err;
      }

      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    });
  } catch (error) {
    next(error);
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

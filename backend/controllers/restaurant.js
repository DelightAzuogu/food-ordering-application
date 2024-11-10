const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Readable } = require("stream");
const path = require("path");
const fs = require("fs");
const {
  googleDriveDelete,
  googleDriveGetLink,
  googleDriveUpload,
} = require("../util/google-drive");
require("dotenv").config();

const { Restaurant } = require("../model/restaurant");
const ValErrorCheck = require("../util/validationError");
const newError = require("../util/error");
const { MenuItem } = require("../model/menu-item");
const { Cart } = require("../model/cart");
const { Rating } = require("../model/rating");
const { Comment } = require("../model/comments");

//sign auth token
const _signToken = (restaurant) => {
  return jwt.sign(
    {
      id: restaurant.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "20h",
    }
  );
};

//restauratn sign up page
exports.putSignupRest = async (req, res, next) => {
  try {
    const valErr = ValErrorCheck(req);
    if (valErr) throw valErr;

    const email = req.body.email;
    const name = req.body.name;
    const pw = req.body.password;
    const confirmPw = req.body.confirmPassword;
    const address = req.body.address || "";
    const city = req.body.city || "";
    const phone = req.body.phone;

    //confirm the passwords
    if (confirmPw !== pw) {
      throw newError("passwords not match", 400);
    }

    //hash the password
    const hashpw = bcrypt.hashSync(pw, 12);

    let imageId = "";
    let imageUrl = "";
    if (req.file) {
      // this is the implementation if you where going to save the image in google drive
      // const stream = Readable.from(req.file.buffer);
      // const uploadImg = await googleDriveUpload(req, stream);
      // if (uploadImg instanceof Error) {
      //   console.log("error upload");
      //   throw uploadImg;
      // }
      // imageId = uploadImg.data.id;
      // const imgLink = await googleDriveGetLink(uploadImg.data.id);

      // if (imgLink instanceof Error) {
      //   const deleteImg = googleDriveDelete(imageId);
      //   if (deleteImg instanceof Error) {
      //     console.log("error deleting img");
      //     throw deleteImg;
      //   }
      //   throw imgLink;
      // }
      // imageUrl = imgLink.data.webViewLink;

      const relativeFilePath = req.file.path;
      const rootDirectory = path.resolve(__dirname, "../");
      imageUrl = path.resolve(rootDirectory, path.resolve(relativeFilePath));
    }

    //create the rest
    const createRest = {
      name,
      email,
      password: hashpw,
      location: { address, city },
      phone,
      imageId,
      imageUrl:
        imageUrl != ""
          ? imageUrl
          : "https://lh3.google.com/u/1/d/1EWwJpLsKMrXIhvPOgDqJLeS8sK6Yzztp=w1366-h668-iv1",
    };

    const restaurant = await Restaurant.create(createRest);

    const token = _signToken(restaurant);

    res.status(201).json({ msg: "created", token, id: restaurant.id });
  } catch (error) {
    next(error);
  }
};

//login restaurants
exports.postLoginRestaurant = async (req, res, next) => {
  try {
    const valErr = ValErrorCheck(req);
    if (valErr) {
      throw valErr;
    }

    const restaurant = await Restaurant.findOne({ email: req.body.email });
    if (!restaurant) {
      throw newError("user with email does not exist");
    }

    //check password
    let pwEqual = await bcrypt.compare(req.body.password, restaurant.password);
    if (!pwEqual) {
      throw newError("invalid password", 401);
    }

    const token = _signToken(restaurant);

    restaurant.status = true;
    await restaurant.save();

    //check items in the menu
    const menuItems = await MenuItem.find({ restaurantId: restaurant.id });
    const hasItem = menuItems.length > 0;

    res
      .status(200)
      .json({ msg: "logged in", hasItem, token, id: restaurant.id });
  } catch (error) {
    next(error);
  }
};

//editing the rest
exports.putEditRestaurant = async (req, res, next) => {
  const valErr = ValErrorCheck(req);
  if (valErr) next(valErr);

  try {
    //updating the rest
    const rest = await Restaurant.findOneAndUpdate(
      { _id: req.rest_Id },
      {
        name: req.body.name,
        phone: req.body.phone,
      }
    );

    res.status(200).json({ msg: "edited" });
  } catch (error) {
    next(error);
  }
};

//checking if password is correct
exports.getCheckPassword = async (req, res, next) => {
  const valErr = ValErrorCheck(req);
  if (valErr) next(valErr);

  try {
    const rest = await Restaurant.findOne({ _id: req.rest_Id });

    const passwordMatch = bcrypt.compareSync(req.body.password, rest.password);
    if (passwordMatch) {
      res.status(200).json({ msg: "matched" });
    } else {
      res.status(400).json({ msg: "unmatched" });
    }
  } catch (error) {
    next(error);
  }
};

//deleting the rest
exports.deleteRestaurant = async (req, res, next) => {
  const restId = req.rest_Id;

  try {
    const rest = await Restaurant.findOneAndDelete({ _id: restId });

    //delete the menu items
    const menuItems = await MenuItem.find({ restaurantId: req.restId });

    // for (let i = 0; i < menuItems.length; i++) {
    //   const deleteImg = googleDriveDelete(menuItems[i].imageId);
    //   if (deleteImg instanceof Error) {
    //     throw deleteImg;
    //   }
    //   await MenuItem.deleteMany({ id: menuItems[i].id });
    // }

    //delete cartItems
    await Cart.deleteMany({ restaurantId: restId });

    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    next(error);
  }
};

//geting a rest with id
exports.getRestaurant = async (req, res, next) => {
  try {
    const Id = req.params.id;

    // getting the restaurant from DB
    const restaurant = await Restaurant.findOne({ _id: Id });
    if (!restaurant) {
      throw newError("restaurant not found", 400);
    }

    // getting the restaurant ratings
    const restaurantRatings = await Rating.find({ restaurant: restaurant._id });

    // calculating the average rating
    let avgRating = 0;
    if (restaurantRatings.length > 0) {
      avgRating = restaurantRatings.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = avgRating / restaurantRatings.length;
    }

    // getting the restaurant menu
    let restaurantMenu = await MenuItem.find({
      restaurant: restaurant._id,
    });

    restaurantMenu = restaurantMenu.map((m) => ({
      ...m,
      imageUrl: isURL(m.imageUrl)
        ? m.imageUrl
        : fs.readFileSync(m.imageUrl, { encoding: "base64" }),
    }));

    res.status(200).json({
      restaurant: {
        ...restaurant.toObject(),
        rating: avgRating,
      },
      menu: restaurantMenu,
    });
  } catch (error) {
    next(error);
  }
};

//getting all the restaurants
exports.getRestaurants = async (req, res, next) => {
  try {
    // Step 1: Calculate the average rating for each restaurant
    const averageRatings = await Rating.aggregate([
      {
        $group: {
          _id: "$restaurant",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    // Step 2: Create a lookup object for average ratings
    const ratingsLookup = averageRatings.reduce((acc, curr) => {
      acc[curr._id] = curr.avgRating;
      return acc;
    }, {});

    // Step 3: Fetch all restaurants
    let restaurants = await Restaurant.find();

    // Step 4: Map through restaurants to include average rating and handle image URLs
    restaurants = restaurants.map((r) => ({
      ...r.toObject(),
      rating: ratingsLookup[r._id] || 0, // Set default rating to 0 if no ratings exist
      imageUrl: isURL(r.imageUrl)
        ? r.imageUrl
        : fs.readFileSync(r.imageUrl, { encoding: "base64" }),
    }));

    res.status(200).json({ restaurants });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantImage = async (req, res, next) => {
  try {
    const restId = req.params.restaurantId;

    const restaurant = await Restaurant.findOne({ _id: restId });
    if (!restaurant) {
      throw newError("restaurant not found", 404);
    }

    fs.readFile(restaurant.imageUrl, (err, data) => {
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

// get all restaurant comments
exports.getRestaurantComments = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;

    let restaurantComments = await Comment.find({ restaurantId })
      .populate("user")
      .sort({ createdAt: -1 });

    const commentsDto = restaurantComments.map((comment) => {
      return {
        _id: comment._id,
        userName: comment.user.firstname + " " + comment.user.lastname,
        comment: comment.comment,
        reply: comment.reply,
      };
    });

    res.status(200).json(commentsDto);
  } catch (error) {
    next(error);
  }
};

exports.postCommentReply = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const reply = req.body.reply;

    // get the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found", 404);
    }

    // update reply
    comment.reply = reply;
    await comment.save();

    res.status(200).json();
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

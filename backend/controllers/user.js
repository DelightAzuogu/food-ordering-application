const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { User } = require("../model/user");
const validationError = require("../util/validationError");
const newError = require("../util/error");
const { ObjectId } = require("mongodb");
const { Rating } = require("../model/rating");
const { Restaurant } = require("../model/restaurant");
const { Comment } = require("../model/comments");

//sign the token
const _signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      // expiresIn: "1h",
    }
  );
};

//signup user
exports.postSignupUser = async (req, res, next) => {
  try {
    const valErr = validationError(req);
    if (valErr) {
      throw valErr;
    }

    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    //confirm passwords
    if (confirmPassword !== password) {
      throw newError("passwords do not match", 401);
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 12);

    //create user
    const createUser = {
      firstname,
      lastname,
      password: hashPassword,
      email,
    };

    const user = await User.create(createUser);

    const token = _signToken(user);

    res.status(201).json({
      msg: "account created",
      token,
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

//login user
exports.postLoginUser = async (req, res, next) => {
  try {
    const valErr = validationError(req);
    if (valErr) throw valErr;

    const email = req.body.email;
    const pw = req.body.password;

    const user = await User.findOne({ email });

    //check password
    const pwEqual = bcrypt.compareSync(pw, user.password);

    if (!pwEqual) {
      throw newError("invalid Password", 400);
    }

    const token = _signToken(user);

    res.status(200).json({ msg: "logged in", token, userId: user._id });
  } catch (err) {
    next(err);
  }
};

//EDIT
exports.putEditUserDetails = async (req, res, next) => {
  try {
    const valErr = validationError(req);
    if (valErr) throw valErr;

    //editing the user
    User.findOneAndUpdate(
      { _id: req.user_Id },
      {
        firstname: req.body.firstname,
        phone: req.body.phone,
        lastname: req.body.lastname,
      }
    );

    res.status(201).json({ msg: "updated" });
  } catch (err) {
    next(err);
  }
};

//confirming password
exports.postConfirmPassword = async (req, res, next) => {
  try {
    const password = req.body.password;

    const user = await User.findOne({ _id: req.user_Id });

    //check the password
    const pwEqual = bcrypt.compareSync(password, user.password);
    if (!pwEqual) {
      res.status(400).json({ msg: pwEqual });
    } else {
      res.status(200).json({ msg: pwEqual });
    }
  } catch (err) {
    next(err);
  }
};

exports.postAddLocation = async (req, res, next) => {
  try {
    const valErr = validationError(req);
    if (valErr) {
      throw valErr;
    }

    const { address, city } = req.body;
    const userId = req.userId;

    const user = await User.findOne({ _id: ObjectId(userId) });
    if (!user) {
      throw newError("user not Found", 404);
    }

    user.location = [...user.location, { address: address, city: city }];

    await user.save();

    res.status(200).json({ msg: "location created", locations: user.location });
  } catch (err) {
    next(err);
  }
};

exports.postDeleteLocation = async (req, res, next) => {
  try {
    const locationId = req.params.locationId;

    const userId = req.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw newError("user not found", 404);
    }

    user.location = user.location.filter((e) => e._id != locationId);

    user.save();

    res.status(201).json({ msg: "deleted", locations: user.location });
  } catch (error) {
    next(error);
  }
};

exports.getUserLocations = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw newError("user not found", 404);
    }

    res.status(200).json({ locations: user.location });
  } catch (error) {
    next(error);
  }
};

exports.postUserRating = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { rating, restaurantId } = req.params;

    // checking if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw newError("Restaurant not found", 404);
    }

    //getting the user Rating
    const userRating = await Rating.findOne({
      user: userId,
      restaurant: restaurantId,
    });
    if (userRating) {
      // update the user Rating if it exists
      userRating.rating = rating;

      userRating.save();
    } else {
      await Rating.create({
        rating: rating,
        user: userId,
        restaurant: restaurantId,
      });
    }

    res.status(201).json({ msg: "rating saved" });
  } catch (error) {
    next(error);
  }
};

exports.postUserComment = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;

    const commentString = req.body.comment;

    //check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found", 404);
    }

    //create the user comment
    const comment = await Comment.create({
      comment: commentString,
      restaurant: restaurantId,
      user: req.userId,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
};

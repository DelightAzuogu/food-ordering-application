const { ObjectId } = require("mongodb");
const { Schema, default: mongoose } = require("mongoose");

const ratingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  //this should be a maximum of 10
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 10;
      },
      message: "Rating should be between 0 and 10",
    },
  },
});

exports.Rating = mongoose.model("Rating", ratingSchema);

const { Schema, default: mongoose } = require("mongoose");

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    required: true,
    type: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: "closed",
  },
  imageUrl: {
    type: String,
    default:
      "https://lh3.google.com/u/1/d/1EWwJpLsKMrXIhvPOgDqJLeS8sK6Yzztp=w1366-h668-iv1",
  },
});

exports.Restaurant = mongoose.model("Restaurant", restaurantSchema);

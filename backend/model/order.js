const { ObjectId } = require("mongodb");
const { Schema, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
  location: {
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
    required: true,
  },
  Date: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
  items: {
    type: [
      {
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        item: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        status: {
          type: String,
          default: "pending",
        },
        restaurant: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Restaurant",
          required: true,
          default: ObjectId("6323fd480d232019af51b9a3"),
        },
      },
    ],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

exports.Order = mongoose.model("Order", orderSchema);

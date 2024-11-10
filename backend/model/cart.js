const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  items: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      _id: false,
    },
  ],
});

exports.Cart = mongoose.model("Cart", cartSchema);

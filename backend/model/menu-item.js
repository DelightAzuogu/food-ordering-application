const { Schema, default: mongoose } = require("mongoose");

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    default:
      "https://lh3.google.com/u/1/d/1g10iaTr6yfjK3JBr428YvUZfWq_ctyuZ=w1366-h668-iv1",
  },

  imageId: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

exports.menuItemSchema = menuItemSchema;
exports.MenuItem = mongoose.model("MenuItem", menuItemSchema);

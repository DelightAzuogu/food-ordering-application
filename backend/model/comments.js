const { ObjectId } = require("mongodb");
const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema(
  {
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
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Comment = mongoose.model("Comment", commentSchema);

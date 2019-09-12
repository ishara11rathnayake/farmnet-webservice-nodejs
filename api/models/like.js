const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: { type: Date, required: true, default: Date.now() },
  postType: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
});

module.exports = mongoose.model("Like", likeSchema);

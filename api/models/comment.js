const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String, required: true },
  postType: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
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

module.exports = mongoose.model("Comment", commentSchema);

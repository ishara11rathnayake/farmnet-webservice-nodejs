const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  articleTitle: { type: String, required: true },
  content: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  date: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Article", articleSchema);

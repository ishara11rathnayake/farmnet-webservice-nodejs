const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ratedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ratingScore: { type: Number, default: 0.0 }
});

module.exports = mongoose.model("Rating", ratingSchema);

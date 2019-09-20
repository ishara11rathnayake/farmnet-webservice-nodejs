const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  adTitle: { type: String, required: true },
  adDescription: { type: String, required: true },
  price: { type: Number },
  adsImage: { type: String, required: true },
  contactNumber: { type: String, required: true },
  hashtags: { type: [String] },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Advertisement", advertisementSchema);

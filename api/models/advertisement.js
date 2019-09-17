const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, require: true },
  adsImage: { type: String, require: true },
  contactNumber: { type: String, require: true },
  hashtags: { type: [String] },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Advertisement", advertisementSchema);

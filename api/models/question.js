const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String, require: true },
  hashtags: { type: [String] },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Question", questionSchema);

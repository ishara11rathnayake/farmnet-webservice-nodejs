const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: { type: String, require: true },
  description: { type: String },
  hashtags: { type: [String] },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  numberOfAnswers: { type: Number, default: 0 }
});

module.exports = mongoose.model("Question", questionSchema);

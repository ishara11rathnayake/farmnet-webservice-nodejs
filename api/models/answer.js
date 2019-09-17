const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String, require: true },
  date: { type: Date, required: true },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Answer", answerSchema);

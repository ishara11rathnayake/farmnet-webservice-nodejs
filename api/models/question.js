const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

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

questionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Question", questionSchema);

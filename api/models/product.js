const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productImage: { type: String, required: true },
  timelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Timeline"
  }
});

module.exports = mongoose.model("Product", productSchema);

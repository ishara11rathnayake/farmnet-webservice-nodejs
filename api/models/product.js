const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, text: true },
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
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  likes: { type: [mongoose.Schema.Types.ObjectId] }
});

module.exports = mongoose.model("Product", productSchema);

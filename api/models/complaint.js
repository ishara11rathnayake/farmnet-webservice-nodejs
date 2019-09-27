const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  complainedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Complaint", complaintSchema);

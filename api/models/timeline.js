const mongoose = require("mongoose");

const { Task } = require("../models/timelinetask");

const timelineSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  tasks: { type: [Task] },
  date: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Timeline", timelineSchema);

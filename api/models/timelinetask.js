const mongoose = require("mongoose");

const timelineTaskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String },
  imageUrl: { type: String },
  date: { type: Date, default: new Date() }
});

module.exports.Task = timelineTaskSchema;
module.exports.TaskModel = mongoose.model("Task", timelineTaskSchema);

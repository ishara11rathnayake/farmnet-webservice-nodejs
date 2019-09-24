const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  user_type: { type: String, required: true },
  profileImage: { type: String },
  address: { type: String },
  contactNumber: { type: String },
  nic: { type: String },
  dob: { type: String },
  rating: { type: Number, default: 0.0 }
});

module.exports = mongoose.model("User", userSchema);

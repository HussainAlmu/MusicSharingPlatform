const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pfp: {
    type: String,
  },
  bio: {
    type: String
  },
  fav: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

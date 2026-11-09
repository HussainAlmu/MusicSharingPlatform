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
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREf6rKt7wcFQR36zRq_MESNDmQq_5PjkKDBKlH0HiJi7NJzEurPn4TNGM&s=10",
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  fav: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

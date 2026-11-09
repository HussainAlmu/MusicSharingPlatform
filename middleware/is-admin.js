const User = require("../models/User.js");

const isAdmin = async (req, res, next) => {
  if (!req.session.theUser) return res.redirect("/auth/sign-in");

  const currentUser = await User.findById(req.session.theUser._id).select("role");
  if (!currentUser || currentUser.role !== "admin") return res.sendStatus(403);

  res.locals.isAdmin = true;
  next();
};

module.exports = isAdmin;

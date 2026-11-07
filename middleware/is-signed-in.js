const isSignedIn = (req, res, next) => {
  if (req.session.theUser) return next();
  res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;

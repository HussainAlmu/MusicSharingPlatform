const passUserToView = (req, res, next) => {
  res.locals.user = req.session.theUser;
  next();
};

module.exports = passUserToView;

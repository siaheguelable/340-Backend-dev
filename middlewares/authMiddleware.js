function checkLogin(req, res, next) {
  if (res.locals.loggedin || req.session.loggedin) {
    return next();
  }
  req.flash("notice", "Please log in to access this page.");
  res.redirect("/account/login");
}

module.exports = { checkLogin };
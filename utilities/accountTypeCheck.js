function checkEmployeeOrAdmin(req, res, next) {
  if (
    res.locals.loggedin &&
    (res.locals.account_type === "Employee" || res.locals.account_type === "Admin")
  ) {
    return next();
  }
  req.flash("notice", "You must be an employee or admin to access this page.");
  return res.redirect("/account/login");
}
module.exports = { checkEmployeeOrAdmin };
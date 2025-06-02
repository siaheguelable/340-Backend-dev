const utilities = require("../utilities")
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // If using flash messages:
  let message = req.flash ? req.flash("message") : null;
  res.render("account/login", {
    title: "Login",
    nav,
    message: null, // <-- add this line
  });
}

// signup view
async function buildSignup(req, res, next) {
  let nav = await utilities.getNav();
  // If using flash messages:
  let message = req.flash ? req.flash("message") : null;
  res.render("account/signup", { errors: null, title: "Sign Up", nav, message });
}



// registration process
async function handleSignup(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  const regResult = await accountModel.signup(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = { buildLogin , buildSignup , handleSignup };

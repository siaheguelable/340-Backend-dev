const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash()
  });
}

/* ****************************************
 *  Deliver signup view
 * *************************************** */
async function buildSignup(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/signup", { errors: null, title: "Sign Up", nav, messages: req.flash() });
}

/* ****************************************
 *  Registration process
 * *************************************** */
async function handleSignup(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.signup(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash()
      });
    } else {
      throw new Error("Registration failed. No account created.");
    }
  } catch (error) {
    req.flash("notice", "Sorry, the registration failed: " + error.message);
    return res.status(501).render("account/signup", {
      title: "Registration",
      nav,
      errors: [error.message],
      messages: req.flash()
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: req.flash()
    });
  }

  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (passwordMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash()
      });
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: req.flash()
    });
  }
}

/* ****************************************
 *  Show account management view
 * ************************************ */
function showAccountView(req, res) {
  res.render('account/index', {
    title: 'My Account',
    messages: req.flash()
  });
}

module.exports = { buildLogin, buildSignup, handleSignup, accountLogin, showAccountView };

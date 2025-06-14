const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

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
async function showAccountView(req, res) {
  let nav = await utilities.getNav();
  // Get these values from your session, JWT, or database as needed
  const account_id = res.locals.account_id;
  const profile_picture = res.locals.profile_picture; // or from DB
  const bio = res.locals.bio; // or from DB

  res.render('account/index', {
    title: 'My Account',
    nav,
    messages: req.flash(),
    account_firstname: res.locals.account_firstname,
    account_type: res.locals.account_type,
    account_id,
    index: {
      account_id,
      profile_picture,
      bio
    }
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateView(req, res) {
  let nav = await utilities.getNav();
  const account = await accountModel.getAccountById(req.params.account_id);
  res.render("account/update", {
    title: "Update Account",
    nav,
    account_id: account.account_id,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    errors: [],
    messages: req.flash()
  });
}

/* ****************************************
 *  Update account information
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: errors.array(),
      messages: req.flash()
    });
  }
  try {
    const updateResult = await accountModel.updateAccount(
      req.session.accountId,
      account_firstname,
      account_lastname,
      account_email
    );
    if (updateResult && updateResult.rowCount > 0) {
      req.flash("notice", "Your account information has been updated.");
      return res.redirect("/account/");
    } else {
      throw new Error("Account update failed. Please try again.");
    }
  } catch (error) {
    return res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: [error.message],
      messages: req.flash()
    });
  }
}

/* ****************************************
 *  Update account password
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { current_password, new_password } = req.body;
  try {
    const accountData = await accountModel.getAccountById(req.session.accountId);
    const passwordMatch = await bcrypt.compare(current_password, accountData.account_password);
    if (!passwordMatch) {
      req.flash("notice", "Current password is incorrect.");
      return res.status(400).render("account/update-password", {
        title: "Update Password",
        nav,
        errors: null,
        messages: req.flash()
      });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const updateResult = await accountModel.updatePassword(req.session.accountId, hashedPassword);
    if (updateResult && updateResult.rowCount > 0) {
      req.flash("notice", "Your password has been updated.");
      return res.redirect("/account/");
    } else {
      throw new Error("Password update failed. Please try again.");
    }
  } catch (error) {
    req.flash("notice", "Sorry, the update failed: " + error.message);
    return res.status(501).render("account/update-password", {
      title: "Update Password",
      nav,
      errors: [error.message],
      messages: req.flash()
    });
  }
}

/* ****************************************
 *  Logout process
 * ************************************ */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

// Render profile edit view
async function buildProfileView(req, res) {
  let nav = await utilities.getNav();
  const profile = await accountModel.getProfile(req.params.account_id);
  res.render("account/profile", {
    title: "Edit Profile",
    nav,
    index: {
      account_id: req.params.account_id,
      profile_picture: profile.profile_picture,
      bio: profile.bio
    }
  });
}

// Handle profile update
async function updateProfile(req, res) {
  const { bio } = req.body;
  let profile_picture = req.file ? "/uploads/" + req.file.filename : req.body.current_picture;
  await accountModel.updateProfile(req.body.account_id, profile_picture, bio);
  req.flash("notice", "Profile updated!");
  res.redirect("/account/profile/" + req.body.account_id);
}

module.exports = {
  buildLogin,
  buildSignup,
  handleSignup,
  accountLogin,
  showAccountView,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
  buildProfileView,
  updateProfile
};

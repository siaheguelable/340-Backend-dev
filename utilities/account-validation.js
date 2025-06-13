const { body, validationResult } = require("express-validator");
const utilities = require('.');

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
function registrationRules() {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
async function checkRegData(req, res, next) {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/signup", {
      errors,
      title: "Sign Up",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      messages: req.flash()
    })
    return
  }
  next()
}

function loginRules() {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
}

function checkLoginData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    utilities.getNav().then(nav => {
      res.render("account/login", {
        title: "Login",
        errors: errors.array(),
        account_email: req.body.account_email,
        nav,
        messages: req.flash()
      });
    });
    return;
  }
  next();
}

function updateAccountRules() {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email").trim().isEmail().withMessage("A valid email is required."),
    // Add more rules as needed
  ];
}

// Example checkUpdateAccount middleware
async function checkUpdateAccount(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities").getNav();
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      // ...add sticky fields here...
    });
  }
  next();
}

function passwordRules() {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character.")
  ];
}

async function checkPassword(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities").getNav();
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      // ...add sticky fields here...
    });
  }
  next();
}

module.exports = {
  loginRules,
  registrationRules,
  checkRegData,
  checkLoginData,
  updateAccountRules,
  checkUpdateAccount,
  passwordRules,
  checkPassword,
};
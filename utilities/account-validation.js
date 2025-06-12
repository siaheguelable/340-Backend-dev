const utilities = require('.');
const { body, validationResult } = require('express-validator');

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

module.exports = {
  loginRules,
  registrationRules,
  checkRegData,
  checkLoginData
};
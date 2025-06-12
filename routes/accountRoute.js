const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountsController")
const regValidate = require("../utilities/account-validation");


// Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to signup view
router.get("/signup", utilities.handleErrors(accountController.buildSignup))

// for handling the login form submission
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData, // Make sure this is defined and exported!
  utilities.handleErrors(accountController.accountLogin)
)
// for handling the signup form submission
// Process the registration data
router.post(
  "/signup",
  // Validate the registration data
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.buildSignup)
)


router.get("/", accountController.showAccountView);
module.exports = router

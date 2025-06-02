const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountsController")
const regValidate = require('../utilities/account-validation')

// Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to signup view
router.get("/signup", utilities.handleErrors(accountController.buildSignup))

// for handling the login form submission
router.post("/login", utilities.handleErrors(accountController.handleLogin))
// for handling the signup form submission
// Process the registration data
router.post(
  "/signup",
  // Validate the registration data
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.buildSignup)
)

module.exports = router

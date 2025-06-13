const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountsController")
const regValidate = require("../utilities/account-validation");
const validate = require("../utilities/account-validation");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

// Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to signup view
router.get("/signup", utilities.handleErrors(accountController.buildSignup))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
  "/signup",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.handleSignup) // <-- FIXED
)

router.get("/", accountController.showAccountView);
router.get("/update/:account_id", accountController.buildUpdateView);
router.post("/update", validate.updateAccountRules(), validate.checkUpdateAccount, accountController.updateAccount);
router.post("/update-password", validate.passwordRules(), validate.checkPassword, accountController.updatePassword);
router.get("/logout", accountController.logout);
router.get("/profile/:account_id", accountController.buildProfileView);
router.post("/profile", upload.single("profile_picture"), accountController.updateProfile);

module.exports = router

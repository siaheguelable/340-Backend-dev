const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/add-inventoryController")
const regValidate = require('../utilities/add-inventory-validation')
const addVehicleController = require("../controllers/addVehicleController")


//management rout

router.get("/management",  utilities.handleErrors(addVehicleController.buildManagement))


// add classifaction route
// Route to add classifcation  view
router.get("/add-classification", utilities.handleErrors(addVehicleController.buildAddClassification))
// Route to add inventory view
router.get("/add-inventory", utilities.handleErrors(addVehicleController.buildAddVehicle))

// for handling adding classification
router.post("/ladd-classification", utilities.handleErrors(addVehicleController.handleAddClassification))
// for handling the signup form submission
// Process the registration data
router.post(
  "/add-inventory",
  // Validate the registration data
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(addVehicleController.buildSignup)
)
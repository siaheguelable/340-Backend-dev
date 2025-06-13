const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const addVehicleController = require("../controllers/addVehicleController")
const regValidate = require('../utilities/add-inventory-validation')
const { checkEmployeeOrAdmin } = require("../utilities/accountTypeCheck")

// Management route
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(addVehicleController.buildManagement))

// Add classification view
router.get("/add-classification", utilities.handleErrors(addVehicleController.buildAddClassification))
// Add inventory view
router.get("/add-inventory", checkEmployeeOrAdmin, utilities.handleErrors(addVehicleController.buildAddVehicle))

// Handle adding classification
router.post("/add-classification", utilities.handleErrors(addVehicleController.handleAddClassification))

// Handle adding inventory (update this handler as needed)
router.post(
  "/add-inventory",
  // regValidate.registrationRules(),
  // regValidate.checkRegData,
  utilities.handleErrors(addVehicleController.handleAddInventory)
)

// AJAX: Get inventory by classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Build edit inventory view
router.get(
  "/edit/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(addVehicleController.editInventoryView)
);

// Update inventory item
router.post(
  "/update",
  regValidate.newInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(addVehicleController.updateInventory)
);

module.exports = router;

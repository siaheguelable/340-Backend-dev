// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountsController = require("../controllers/accountsController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by inventoryID view
router.get("/detail/:invId", invController.buildByInventoryId);


// Route to build inventory management view
router.get("/management", invController.buildManagement);



module.exports = router;
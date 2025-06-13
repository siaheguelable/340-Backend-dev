// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountsController = require("../controllers/accountsController");
const addVehicleController = require("../controllers/addVehicleController");
const utilities = require("../utilities"); // <-- ADD THIS LINE

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by inventoryID view
router.get("/detail/:invId", invController.buildByInventoryId);




// POST: Handle form submission
router.post('/add-classification', (req, res) => {
  const { classification_name } = req.body;
  // TODO: Add logic to save classification_name to DB
  // For now, redirect or render a success message
  
  // Set a flash message
  req.flash('message', 'Classification added successfully!');
  res.redirect('/inv'); // or wherever you want to go after adding
});


// POST: Handle form submission for adding a vehicle
router.post('/add-inventory', (req, res) => {
  const { make, model, year, price } = req.body;    

  // TODO: Add logic to save vehicle details to DB
  // For now, redirect or render a success message
  
  // Set a flash message
  req.flash('message', 'Vehicle added successfully!');
  res.redirect('/inv'); // or wherever you want to go after adding
});

router.get("/add-inventory", invController.buildAddVehicle);



module.exports = router;
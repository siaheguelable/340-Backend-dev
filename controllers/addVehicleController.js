const addModel = require("../models/add-inventory-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}



// management flash message
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  // If using flash messages:
  let message = req.flash ? req.flash("message")[0]: null
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message,
  })
}

// build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  // If using flash messages:
  let message = req.flash ? req.flash("message")[0] : null
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message,
  })
}

// build add vehicle view
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  // If using flash messages:
  let message = req.flash ? req.flash("vehicle added")[0] : null
  try {
    const classifications = await invModel.getClassifications();
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList: classifications.rows, // <-- Fix here
      message,
    })
  } catch (error) {
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: [],
      error: "Could not load classifications.",
    });
  }
}

// add classification  process
invCont.handleAddClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name
  const result = await addModel.addClassification(classification_name)
  if (result) {
    req.flash("message", "Classification added successfully.")
    res.status(201).redirect("/inv")
  } else {
    req.flash("message", "Failed to add classification.")
    res.status(501).redirect("/inv/add-classification")
  }
}



module.exports = {
  ...invCont,
  
};
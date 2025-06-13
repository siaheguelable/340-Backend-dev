const addModel = require("../models/add-inventory-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}



// management flash message
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList();
  // If using flash messages:
  let message = req.flash ? req.flash("message")[0]: null
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message,
    classificationSelect
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

invCont.handleAddInventory = async function (req, res, next) {
  res.send("Add Inventory handler placeholder");
}

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  if (!itemData) {
    req.flash("message", "Inventory item not found.")
    return res.redirect("/inv")
  }
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_year, inv_miles, inv_color, classification_id
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_year, inv_miles, inv_color, classification_id
  );
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    });
  }
}



module.exports = {
  ...invCont,
  handleAddInventory: invCont.handleAddInventory, // <-- This must exist and be exported
}
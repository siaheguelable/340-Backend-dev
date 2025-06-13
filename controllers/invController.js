const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const invId = parseInt(req.params.invId);
  try {
    const data = await invModel.getInventoryById(invId);
    if (!data) {
      next({ status: 404, message: "Vehicle not found" });
      return;
    }
    const html = utilities.buildVehicleDetail(data);
    let nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      detailView: html,
      nav
    });
  } catch (err) {
    next(err);
  }
}



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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData && invData.length && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}




module.exports = {
  ...invCont,

};
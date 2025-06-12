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

invCont.buildAddVehicle = async function (req, res, next) {
  // your code here
}



module.exports = {
  ...invCont,

};
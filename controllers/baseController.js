const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //flash message example
  // req.flash is used to set a flash message
  //req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController

const { body, validationResult } = require("express-validator");
const utilities = require('.');
const validate={}

validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please enter the make."), // on error this message is sent.

      // model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."), // on error this message is sent.

      // valid year is required and must be a number
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("A valid year is required."),

      // description is required and must be string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a description."),

      // price is required and must be a number
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("A valid price is required."),
      // miles is required and must be a number
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("A valid mileage is required."),
      // color is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a color."),
      ]
  }


 /* ******************************
  * Check data and return errors or continue to add inventory
  * This function is used in the add-inventory route
  * ***************************** */
 validate.checkAddData = async (req, res, next) => {
   const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("inventory/add-inventory", {
       errors,
       title: "Add Inventory",
       // pass the data back to the form so user doesn't have to re-enter it  
       nav,
       inv_make,
       inv_model,
       inv_year,
       inv_description,
       inv_price,
       inv_miles,
       inv_color
     })
     return
   }
   next()
 }

function newInventoryRules() {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isNumeric().withMessage("Price must be a number."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Year is required and must be valid."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("classification_id").isInt().withMessage("Classification is required.")
  ];
}

function checkUpdateData(req, res, next) {
  // ...logic...
}

module.exports = {
  // ...other exports...
  newInventoryRules,
  checkUpdateData,
  // ...other exports...
};
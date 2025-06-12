const pool = require("../database/");
//acitvity for account model

/* *****************************
*   insert new classification into the database
*   and return the inserted row
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    throw error // Let the controller handle the error
  }
}

async function addVehicle(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color])
  } catch (error) {
    throw error // Let the controller handle the error
  }
}



module.exports = {
  addClassification,
  addVehicle
};
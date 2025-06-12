const pool = require("../database");

/* Register new account */
async function signup(account_firstname, account_lastname, account_email, account_password) {
  const sql = `
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES ($1, $2, $3, $4, 'Client')
    RETURNING *`;
  try {
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}

/* Return account data using email address */
async function getAccountByEmail(account_email) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
    FROM account
    WHERE account_email = $1`;
  try {
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
  getAccountByEmail,
};
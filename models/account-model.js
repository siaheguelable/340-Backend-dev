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

// Update profile picture and bio
async function updateProfile(account_id, profile_picture, bio) {
  const sql = `
    UPDATE accounts
    SET profile_picture = $1, bio = $2
    WHERE account_id = $3
    RETURNING *;
  `;
  const data = await pool.query(sql, [profile_picture, bio, account_id]);
  return data.rows[0];
}

// Get profile data
async function getProfile(account_id) {
  const sql = `SELECT account_firstname, account_lastname, profile_picture, bio FROM accounts WHERE account_id = $1;`;
  const data = await pool.query(sql, [account_id]);
  return data.rows[0];
}

module.exports = {
  signup,
  getAccountByEmail,
  updateProfile,
  getProfile,
};
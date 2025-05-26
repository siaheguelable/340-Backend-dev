const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "production") {
  // Render requires SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Local development, no SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

// Optional: unified export for both dev/prod
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (process.env.NODE_ENV !== "production") {
        console.log("executed query", { text });
      }
      return res;
    } catch (error) {
      console.error("query error", { text, error });
      throw error;
    }
  },
  pool, // Export pool too, in case you want to use `.connect()`
};

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
require("dotenv").config();
const pool = require("./database/");
const utilities = require('./utilities/');
const baseController = require("./controllers/baseController");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Route imports
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoutes = require("./routes/errorRoutes");
const static = require("./routes/static");
const addInventoryRoute = require("./routes/addInventoryRoute");

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(utilities.checkJWTToken);
app.use((req, res, next) => {
  res.locals.loggedin = req.cookies.jwt ? true : false;
  if (req.cookies.jwt) {
    const payload = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
    res.locals.account_firstname = payload.account_firstname;
    res.locals.account_type = payload.account_type;
    res.locals.account_id = payload.account_id;
  }
  next();
});

/* View Engine */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files
app.use(express.static("public"));

// Main routes
app.use(static);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/inv", addInventoryRoute); // This line is critical!

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Error routes last
app.use("/", errorRoutes);

// 404 handler (must be last)
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

// Error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const nav = await utilities.getNav();
  res.status(status).render("errors/error", {
    title: "Server Error",
    message: err.message,
    status,
    nav,
  });
});

const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

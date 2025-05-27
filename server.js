/* ******************************************

 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *********************************

require session package and DB connection******/
 const session = require('express-session')
const pool = require('./database/')
 /***********************/
const utilities = require('./utilities/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoutes = require("./routes/errorRoutes");

app.use("/", errorRoutes);




/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/layout')

// Serve static files from /public
app.use(express.static('public'))

// Routes
const static = require("./routes/static")
app.use(static)

// index route unit 3 activity
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes unit 3 activity
app.use("/inv", inventoryRoute)


// File Not Found Route - must be last route in list
// Catch 404 errors
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

// Central error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).render("error", {
    title: "Server Error",
    message: err.message,
    status,
  });
});




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})




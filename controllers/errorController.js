function throwErrorExample(req, res, next) {
  try {
    // This is an intentional error for testing
    throw new Error("Intentional Server Error for Testing");
  } catch (err) {
    next(err); // Send error to the middleware
  }
}

module.exports = { throwErrorExample };

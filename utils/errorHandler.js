class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    // this.location=location
    // console.log("inside error handler");
  }
}

module.exports = ErrorHandler

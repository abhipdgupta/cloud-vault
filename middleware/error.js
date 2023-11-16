const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error'
  err.statusCode = err.statusCode || 500

  console.error('Error Stack Trace ->', err.stack)

  if (err.name === 'BSONTypeError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid BSON data format in the request',
      status_code: 400,
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid Token',
      status_code: 400,
    })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid Data Type',
      status_code: 400,
    })
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    status_code: err.statusCode,
  })
}

module.exports = errorMiddleware

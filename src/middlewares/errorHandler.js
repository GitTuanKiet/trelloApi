import { StatusCodes } from 'http-status-codes'
import { ENV } from '~/config/environment'

const isProduction = ENV.NODE_ENV === 'production'

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {

  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  const responseError = {
    message: err.message || StatusCodes[err.statusCode],
    status: err.statusCode,
    stack: err.stack
  }

  if (isProduction) delete responseError.stack

  res.status(err.statusCode).json(responseError)
}

module.exports = errorHandler
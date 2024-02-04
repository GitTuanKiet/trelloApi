import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const loginValidation = async (req, res, next) => {
  try {
    const schemaLogin = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
        'string.base': 'Email must be a string'
      }),
      password: Joi.string().required().min(6).max(33).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 33 characters long',
        'string.base': 'Password must be a string'
      }),
      status: Joi.equal('active', 'inactive').default('active')
    })
    await schemaLogin.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const registerValidation = async (req, res, next) => {
  try {
    const schemaRegister = Joi.object({
      firstName: Joi.string().required().min(3).max(33).trim().strict().messages({
        'string.empty': 'First Name is required',
        'string.min': 'First Name must be at least 3 characters long',
        'string.max': 'First Name must be at most 33 characters long',
        'string.base': 'First Name must be a string'
      }),
      lastName: Joi.string().required().min(3).max(33).trim().strict().messages({
        'string.empty': 'Last Name is required',
        'string.min': 'Last Name must be at least 3 characters long',
        'string.max': 'Last Name must be at most 33 characters long',
        'string.base': 'Last Name must be a string'
      }),
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
        'string.base': 'Email must be a string'
      }),
      password: Joi.string().required().min(6).max(33).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 33 characters long',
        'string.base': 'Password must be a string'
      }),
      status: Joi.equal('active', 'inactive').default('active')
    })
    await schemaRegister.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const forgotPasswordValidation = async (req, res, next) => {
  try {
    const schemaForgotPassword = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
        'string.base': 'Email must be a string'
      })
    })
    await schemaForgotPassword.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateValidation = async (req, res, next) => {
  try {
    const schemaUpdate = Joi.object({
      firstName: Joi.string().min(3).max(33).trim().strict().messages({
        'string.empty': 'First Name is required',
        'string.min': 'First Name must be at least 3 characters long',
        'string.max': 'First Name must be at most 33 characters long',
        'string.base': 'First Name must be a string'
      }),
      lastName: Joi.string().min(3).max(33).trim().strict().messages({
        'string.empty': 'Last Name is required',
        'string.min': 'Last Name must be at least 3 characters long',
        'string.max': 'Last Name must be at most 33 characters long',
        'string.base': 'Last Name must be a string'
      }),
      email: Joi.string().email().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
        'string.base': 'Email must be a string'
      })
    })
    await schemaUpdate.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updatePasswordValidation = async (req, res, next) => {
  try {
    if (req.body.newPassword !== req.body.confirmPassword) {
      throw new Error('Password and Confirm Password must be the same')
    }
    const schemaUpdatePassword = Joi.object({
      oldPassword: Joi.string().required().min(6).max(33).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 33 characters long',
        'string.base': 'Password must be a string'
      }),
      newPassword: Joi.string().required().min(6).max(33).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 33 characters long',
        'string.base': 'Password must be a string'
      }),
      confirmPassword: Joi.string().required().min(6).max(33).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 33 characters long',
        'string.base': 'Password must be a string'
      })
    })
    await schemaUpdatePassword.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const authValidator = {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  updateValidation,
  updatePasswordValidation
}
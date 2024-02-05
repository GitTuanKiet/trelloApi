import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const loginValidation = async (req, res, next) => {
  try {
    const schemaLogin = Joi.object({
      email: Joi.string().email().required().trim().strict(),
      password: Joi.string().required().min(6).max(33)
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
      firstName: Joi.string().required().min(3).max(33).trim().strict(),
      lastName: Joi.string().required().min(3).max(33).trim().strict(),
      email: Joi.string().email().required().trim().strict(),
      password: Joi.string().required().min(6).max(33)
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
      email: Joi.string().email().required().trim().strict()
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
      firstName: Joi.string().min(3).max(33).trim().strict(),
      lastName: Joi.string().min(3).max(33).trim().strict(),
      email: Joi.string().email().trim().strict()
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
      oldPassword: Joi.string().required().min(6).max(33),
      newPassword: Joi.string().required().min(6).max(33),
      confirmPassword: Joi.string().required().min(6).max(33)
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
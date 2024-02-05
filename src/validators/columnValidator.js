import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createColumnValidation = async (req, res, next) => {
  try {
    const schemaCreateColumn = Joi.object({
      title: Joi.string().required().min(3).max(33).trim().strict()
    })
    await schemaCreateColumn.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateColumnValidation = async (req, res, next) => {
  try {
    const schemaUpdateColumn = Joi.object({
      _id:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().min(3).max(33).trim().strict(),
      cardOrderIds:Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE))
    })
    await schemaUpdateColumn.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const destroyColumnValidation = async (req, res, next) => {
  try {
    const schemaDestroyColumn = Joi.object({
      _id:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)
    })
    await schemaDestroyColumn.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const columnValidator = {
  createColumnValidation,
  updateColumnValidation,
  destroyColumnValidation
}

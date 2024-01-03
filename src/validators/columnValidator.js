import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createColumnValidation = async (req, res, next) => {
  try {
    const schemaCreateColumn = Joi.object({
      boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().required().min(3).max(33).trim().strict().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      })
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
      boardId:Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().min(3).max(33).trim().strict().messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      })
    })
    await schemaUpdateColumn.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const deleteColumnValidation = async (req, res, next) => {
  try {
    const schemaDeleteColumn = Joi.object({
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)
    })

    await schemaDeleteColumn.validateAsync({ columnId : req.params.id })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const columnValidator = {
  createColumnValidation,
  updateColumnValidation,
  deleteColumnValidation
}

import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createBoardValidation = async (req, res, next) => {
  try {
    const schemaCreateBoard = Joi.object({
      title: Joi.string().required().min(3).max(33).trim().strict().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      }),
      description: Joi.string().required().min(6).max(255).trim().strict().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 6 characters long',
        'string.max': 'Description must be at most 255 characters long',
        'string.base': 'Description must be a string'
      }),
      type: Joi.string().required().valid('public', 'private').default('public').messages({
        'string.empty': 'Type is required',
        'any.only': 'Type must be public or private',
        'string.base': 'Type must be a string'
      })
    })
    await schemaCreateBoard.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateBoardValidation = async (req, res, next) => {
  try {
    const schemaUpdateBoard = Joi.object({
      title: Joi.string().min(3).max(33).trim().strict().messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      }),
      description: Joi.string().min(6).max(255).trim().strict().messages({
        'string.min': 'Description must be at least 6 characters long',
        'string.max': 'Description must be at most 255 characters long',
        'string.base': 'Description must be a string'
      }),
      type: Joi.string().valid('public', 'private').messages({
        'any.only': 'Type must be public or private',
        'string.base': 'Type must be a string'
      }),
      columnOrderIds:Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE))
    })
    await schemaUpdateBoard.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const setMoveCardWithoutColumnValidator = async (req, res, next) => {
  try {
    const schemaSetMoveCardWithoutColumn = Joi.object({
      cardId: Joi.string().required().pattern(OBJECT_ID_REGEX).required().messages(OBJECT_ID_MESSAGE),
      prevColumnId: Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      prevCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)),
      nextColumnId: Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      nextCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE))
    })
    await schemaSetMoveCardWithoutColumn.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const boardValidator = {
  createBoardValidation,
  updateBoardValidation,
  setMoveCardWithoutColumnValidator
}



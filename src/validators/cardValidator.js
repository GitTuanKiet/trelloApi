import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCardValidation = async (req, res, next) => {
  try {
    const schemaCreateCard = Joi.object({
      boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().required().min(3).max(33).trim().strict().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      }),
      description: Joi.string().min(6).max(255).trim().strict().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 6 characters long',
        'string.max': 'Description must be at most 255 characters long',
        'string.base': 'Description must be a string'
      })
    })

    await schemaCreateCard.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateCardValidation = async (req, res, next) => {
  try {
    const schemaUpdateCard = Joi.object({
      boardId:Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      columnId:Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().min(3).max(33).trim().strict().messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 33 characters long',
        'string.base': 'Title must be a string'
      }),
      description: Joi.string().min(6).max(255).trim().strict().messages({
        'string.min': 'Description must be at least 6 characters long',
        'string.max': 'Description must be at most 255 characters long',
        'string.base': 'Description must be a string'
      })
    })
    await schemaUpdateCard.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const cardValidator = {
  createCardValidation,
  updateCardValidation
}
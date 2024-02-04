import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCardValidation = async (req, res, next) => {
  try {
    const schemaCreateCard = Joi.object({
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().required().min(3).max(33).trim().strict(),
      description: Joi.string().min(6).max(255).trim().strict(),
      cover:Joi.binary()
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
      _id:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().min(3).max(33).trim().strict(),
      description: Joi.string().min(6).max(255).trim().strict(),
      cover:Joi.binary()
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
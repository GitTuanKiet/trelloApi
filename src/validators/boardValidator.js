import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createBoardValidation = async (req, res, next) => {
  try {
    const schemaCreateBoard = Joi.object({
      title: Joi.string().required().min(3).max(33).trim().strict(),
      description: Joi.string().required().min(6).max(255).trim().strict()
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
      title: Joi.string().min(3).max(33).trim().strict(),
      description: Joi.string().min(6).max(255).trim().strict(),
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



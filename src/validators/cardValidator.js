import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import path from 'path'

// const isImageFile = (fileName) => {
//   const ext = path.extname(fileName).toLowerCase()
//   return ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)
// }

const createCardValidation = async (req, res, next) => {
  try {
    if (req.file) {
      // if (!isImageFile(req.file.originalname)) {
      //   return next(new ApiError(StatusCodes.BAD_REQUEST, 'Only images are allowed'))
      // } else {
      req.body.cover = path.join('/', req.file.path)
      // }
    }

    const schemaCreateCard = Joi.object({
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().required().min(3).max(33).trim().strict(),
      description: Joi.string().min(6).max(255).trim().strict(),
      cover: Joi.string().pattern(/^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/).messages({
        'string.pattern.base': 'Định dạng đường dẫn ảnh không hợp lệ'
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
      _id:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
      title: Joi.string().min(3).max(33).trim().strict(),
      description: Joi.string().min(6).max(255).trim().strict(),
      cover: Joi.string().pattern(/^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/).messages({
        'string.pattern.base': 'Định dạng đường dẫn không hợp lệ'
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
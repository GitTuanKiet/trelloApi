/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { fixObjectId } from '~/utils/formatters'

const NameCardColection = 'cards'

const validateCard = async (data) => {
  try {
    return await schemaCreateCard.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameCardColection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createCard = async (data) => {
  try {
    const validatedData = await validateCard(data)
    validatedData.boardId = fixObjectId(validatedData.boardId)
    validatedData.columnId = fixObjectId(validatedData.columnId)
    return await getMongo().collection(NameCardColection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}


const updateCard = async (id, data) => {
  try {
    if (data.boardId) {
      data.boardId = fixObjectId(data.boardId)
    }
    if (data.columnId) {
      data.columnId = fixObjectId(data.columnId)
    }
    return await getMongo().collection(NameCardColection).findOneAndUpdate(
      { _id: fixObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

const destroyCardsByColumnId = async (columnId) => {
  try {
    return await getMongo().collection(NameCardColection).deleteMany({ columnId: fixObjectId(columnId) })
  } catch (error) {
    throw error
  }
}


export const CardModel = {
  NameCardColection,
  schemaCreateCard,
  createCard,
  updateCard,
  findOneById,
  destroyCardsByColumnId
}

const schemaCreateCard = Joi.object({
  boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),

  title:Joi.string().required().min(3).max(33).trim().strict(),
  description:Joi.string().min(6).max(255).trim().strict(),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

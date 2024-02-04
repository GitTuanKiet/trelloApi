/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { fixObjectId } from '~/utils/formatters'

const NameCardCollection = 'cards'

const validateCard = async (data) => {
  try {
    return await schemaCreateCard.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameCardCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createCard = async (data) => {
  try {
    const validatedData = await validateCard(data)
    validatedData.boardId = fixObjectId(validatedData.boardId)
    validatedData.columnId = fixObjectId(validatedData.columnId)
    return await getMongo().collection(NameCardCollection).insertOne(validatedData)
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
    return await getMongo().collection(NameCardCollection).findOneAndUpdate(
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
    return await getMongo().collection(NameCardCollection).deleteMany({ columnId: fixObjectId(columnId) })
  } catch (error) {
    throw error
  }
}

const destroyCardByBoardId = async (boardId) => {
  try {
    return await getMongo().collection(NameCardCollection).deleteMany({ boardId: fixObjectId(boardId) })
  } catch (error) {
    throw error
  }
}


export const CardModel = {
  NameCardCollection,
  schemaCreateCard,
  createCard,
  updateCard,
  findOneById,
  destroyCardsByColumnId,
  destroyCardByBoardId
}

const schemaCreateCard = Joi.object({
  boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),

  title:Joi.string().required().min(3).max(33).trim().strict(),
  description: Joi.string().min(6).max(255).trim().strict(),
  cover:Joi.binary(),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

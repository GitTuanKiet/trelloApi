/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { fixObjectId } from '~/utils/formatters'

const NameColumnCollection = 'columns'

const validateColumn = async (data) => {
  try {
    return await schemaCreateColumn.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameColumnCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createColumn = async (data) => {
  try {
    const validatedData = await validateColumn(data)
    validatedData.boardId = fixObjectId(validatedData.boardId)
    validatedData.userId = fixObjectId(validatedData.userId)
    return await getMongo().collection(NameColumnCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}


const updateColumn = async (id, data) => {
  if (data.userId) data.userId = fixObjectId(data.userId)
  if (data.boardId) data.boardId = fixObjectId(data.boardId)
  if (data.cardOrderIds) data.cardOrderIds = data.cardOrderIds.map(fixObjectId)
  try {
    return await getMongo().collection(NameColumnCollection).findOneAndUpdate(
      { _id: fixObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

const destroyColumn = async (id) => {
  try {
    return await getMongo().collection(NameColumnCollection).deleteOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}


const pushCardOrderIds = async (id, cardId) => {
  try {
    return await getMongo().collection(NameColumnCollection).updateOne({ _id: fixObjectId(id) }, { $push: { cardOrderIds: fixObjectId(cardId) } })
  } catch (error) {
    throw error
  }
}

const pullCardOrderIds = async (id, cardId) => {
  try {
    return await getMongo().collection(NameColumnCollection).updateOne({ _id: fixObjectId(id) }, { $pull: { cardOrderIds: fixObjectId(cardId) } })
  } catch (error) {
    throw error
  }
}

const destroyColumnByBoardId = async (boardId) => {
  try {
    return await getMongo().collection(NameColumnCollection).deleteMany({ boardId: fixObjectId(boardId) })
  } catch (error) {
    throw error
  }
}

export const ColumnModel = {
  NameColumnCollection,
  schemaCreateColumn,
  createColumn,
  updateColumn,
  destroyColumn,
  findOneById,
  pushCardOrderIds,
  pullCardOrderIds,
  destroyColumnByBoardId
}

const schemaCreateColumn = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  title:Joi.string().required().min(3).max(33).trim().strict(),

  cardOrderIds:Joi.array().items(
    Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)
  ).default([]),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})
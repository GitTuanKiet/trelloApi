/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { ColumnModel } from './columnModel'
import { CardModel } from './cardModel'
import { fixObjectId } from '~/utils/formatters'

const NameBoardCollection = 'boards'

const validateCreate = async (data) => {
  try {
    return await schemaBoard.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameBoardCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createBoard = async (data) => {
  try {
    const validatedData = await validateCreate(data)
    return await getMongo().collection(NameBoardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateBoard = async (id, data) => {
  try {
    if (data.columnOrderIds) {
      data.columnOrderIds = data.columnOrderIds.map((item) => fixObjectId(item))
    }
    return await getMongo().collection(NameBoardCollection).findOneAndUpdate(
      { _id: fixObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

const pushColumnOrderIds = async (id, columnId) => {
  try {
    return await getMongo().collection(NameBoardCollection).updateOne({ _id: fixObjectId(id) }, { $push: { columnOrderIds: fixObjectId(columnId) } })
  } catch (error) {
    throw error
  }
}

const pullColumnOrderIds = async (id, columnId) => {
  try {
    return await getMongo().collection(NameBoardCollection).updateOne({ _id: fixObjectId(id) }, { $pull: { columnOrderIds: fixObjectId(columnId) } })
  } catch (error) {
    throw error
  }
}

const getDetailsBoard = async (id) => {
  try {
    const result = await getMongo().collection(NameBoardCollection).aggregate([
      { $match: { _id: fixObjectId(id), _destroy: false } },
      { $lookup: { from: ColumnModel.NameColumnCollection, localField: '_id', foreignField: 'boardId', as: ColumnModel.NameColumnCollection } },
      { $lookup: { from: CardModel.NameCardColection, localField: '_id', foreignField: 'boardId', as: CardModel.NameCardColection } }
    ]).toArray()
    return result[0]
  } catch (error) {
    throw error
  }
}

export const BoardModel = {
  NameBoardCollection,
  schemaBoard,
  createBoard,
  updateBoard,
  getDetailsBoard,
  findOneById,
  pushColumnOrderIds,
  pullColumnOrderIds
}

const schemaBoard = Joi.object({
  title:Joi.string().required().min(3).max(33).trim().strict(),
  description:Joi.string().required().min(6).max(255).trim().strict(),
  slug:Joi.string().required().min(3).max(66).trim().strict(),
  type:Joi.string().required().valid('public', 'private').default('public'),

  columnOrderIds:Joi.array().items(
    Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)
  ).default([]),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

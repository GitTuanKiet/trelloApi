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
    validatedData.userId = fixObjectId(validatedData.userId)
    return await getMongo().collection(NameBoardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateBoard = async (id, data) => {
  if (data.userId) data.userId = fixObjectId(data.userId)
  if (data.columnOrderIds) data.columnOrderIds = data.columnOrderIds.map(fixObjectId)
  if (data.members) data.members = data.members.map((member) => {
    member._id = fixObjectId(member._id)
    return member
  })

  try {
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

const pushMembers = async (id, member) => {
  try {
    if (member._id) member._id = fixObjectId(member._id)
    return await getMongo().collection(NameBoardCollection).updateOne({ _id: fixObjectId(id) }, { $push: { members: member } })
  } catch (error) {
    throw error
  }
}

const pullMembers = async (id, memberId) => {
  try {
    return await getMongo().collection(NameBoardCollection).updateOne({ _id: fixObjectId(id) }, { $pull: { members: { _id: fixObjectId(memberId) } } })
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
      { $lookup: { from: CardModel.NameCardCollection, localField: '_id', foreignField: 'boardId', as: CardModel.NameCardCollection } },
      { $limit: 1 }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw error
  }
}

const updateBoardMember = async (userId, data) => {
  if (data._id) data._id = fixObjectId(data._id)
  try {
    return await getMongo().collection(NameBoardCollection).updateOne({ 'members._id': fixObjectId(userId) }, { $set: { 'members.$': data } })
  } catch (error) {
    throw error
  }
}

const destroyBoard = async (id) => {
  try {
    return await getMongo().collection(NameBoardCollection).deleteOne({ _id: fixObjectId(id) })
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
  pullColumnOrderIds,
  pushMembers,
  pullMembers,
  destroyBoard,
  updateBoardMember
}

const schemaBoard = Joi.object({
  title:Joi.string().required().min(3).max(33).trim().strict(),
  description:Joi.string().trim().strict(),
  slug:Joi.string().required().min(3).max(66).trim().strict(),

  userId: Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  members: Joi.array().items(Joi.object({
    _id: Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
    firstName: Joi.string().min(3).max(33).trim().strict(),
    lastName: Joi.string().min(3).max(33).trim().strict(),
    email: Joi.string().email(),
    avatar: Joi.string().pattern(/^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/)
  })).default([]),

  columnOrderIds:Joi.array().items(
    Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)
  ).default([]),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

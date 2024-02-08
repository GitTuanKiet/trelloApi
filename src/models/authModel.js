/* eslint-disable no-useless-catch */
import Joi from 'joi'
import fs from 'fs'
import path from 'path'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE, isBcryptHash } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { fixObjectId } from '~/utils/formatters'
import { BoardModel } from './boardModel'

const NameAuthCollection = 'auths'

const schemaAuth = Joi.object({
  firstName: Joi.string().required().min(3).max(33).trim().strict().messages({
    'string.empty': 'First Name is required',
    'string.min': 'First Name must be at least 3 characters long',
    'string.max': 'First Name must be at most 33 characters long',
    'string.base': 'First Name must be a string'
  }),
  lastName: Joi.string().required().min(3).max(33).trim().strict().messages({
    'string.empty': 'Last Name is required',
    'string.min': 'Last Name must be at least 3 characters long',
    'string.max': 'Last Name must be at most 33 characters long',
    'string.base': 'Last Name must be a string'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'string.base': 'Email must be a string'
  }),
  password: Joi.string().required().custom(isBcryptHash).messages({
    'string.empty': 'Password is required',
    'password.invalidHash': 'Password must be a valid bcrypt hash',
    'string.base': 'Password must be a string'
  }),
  avatar: Joi.string().pattern(/^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/).default(null),

  boardJoinIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)).default([]),

  createAt: Joi.date().timestamp().default(Date.now()),
  updateAt: Joi.date().timestamp().default(null),
  _destroy:Joi.boolean().default(false)
})

const validateCreate = async (data) => {
  try {
    return await schemaAuth.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameAuthCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createAuth = async (data) => {
  try {
    const validatedData = await validateCreate(data)
    return await getMongo().collection(NameAuthCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    return await getMongo().collection(NameAuthCollection).findOne({ email })
  }
  catch (error) {
    throw error
  }
}

const updateAuth = async (id, data) => {
  if (data.boardJoinIds) data.boardJoinIds = data.boardJoinIds.map(fixObjectId)
  try {
    if (data.avatar) {
      const user = await findOneById(id)
      if (user.avatar) {
        const filePath = path.join('./', user.avatar)
        await fs.promises.unlink(filePath)
      }
    }
    return await getMongo().collection(NameAuthCollection).findOneAndUpdate(
      { _id: fixObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

const updatePassword = async (id, data) => {
  try {
    return await getMongo().collection(NameAuthCollection).findOneAndUpdate(
      { _id: fixObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

const pushBoardJoinIds = async (id, boardId) => {
  try {
    return await getMongo().collection(NameAuthCollection).updateOne({ _id: fixObjectId(id) }, { $push: { boardJoinIds: fixObjectId(boardId) } })
  } catch (error) {
    throw error
  }
}

const pullBoardJoinIds = async (id, boardId) => {
  try {
    return await getMongo().collection(NameAuthCollection).updateOne({ _id: fixObjectId(id) }, { $pull: { boardJoinIds: fixObjectId(boardId) } })
  } catch (error) {
    throw error
  }
}

const fetchBoardJoinIds = async (userId) => {
  try {
    const result = await getMongo().collection(NameAuthCollection).aggregate([
      {
        $match: { _id: fixObjectId(userId) }
      },
      {
        $lookup: {
          from: BoardModel.NameBoardCollection,
          let: { boardJoinIds: '$boardJoinIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$boardJoinIds']
                }
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                slug: 1,
                description: 1
              }
            }
          ],
          as: 'boards'
        }
      },
      {
        $project: {
          listBoard: '$boards'
        }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) {
    throw error
  }
}

const getListUser = async () => {
  try {
    return await getMongo().collection(NameAuthCollection).find().toArray()
  }
  catch (error) {
    throw error
  }
}

export const AuthModel = {
  NameAuthCollection,
  schemaAuth,
  findOneById,
  createAuth,
  findOneByEmail,
  updateAuth,
  updatePassword,
  pushBoardJoinIds,
  pullBoardJoinIds,
  fetchBoardJoinIds,
  getListUser
}

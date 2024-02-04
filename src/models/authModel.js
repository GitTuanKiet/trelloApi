/* eslint-disable no-useless-catch */
import Joi from 'joi'
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

  boardOwnerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)).default([]),
  status: Joi.equal('active', 'inactive').default('active'),

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

const PushBoardOwnerIds = async (id, boardId) => {
  try {
    return await getMongo().collection(NameAuthCollection).updateOne({ _id: fixObjectId(id) }, { $push: { boardOwnerIds: fixObjectId(boardId) } })
  } catch (error) {
    throw error
  }
}

const PullBoardOwnerIds = async (id, boardId) => {
  try {
    return await getMongo().collection(NameAuthCollection).updateOne({ _id: fixObjectId(id) }, { $pull: { boardOwnerIds: fixObjectId(boardId) } })
  } catch (error) {
    throw error
  }
}

const fetchBoardOwnerIds = async (id) => {
  try {
    const result = await getMongo().collection(NameAuthCollection).aggregate([
      {
        $match: { _id: fixObjectId(id) }
      },
      {
        $lookup: {
          from: BoardModel.NameBoardCollection,
          localField: '_id',
          foreignField: 'userId',
          as: 'boards'
        }
      },
      {
        $unwind: '$boards'
      },
      {
        $group: {
          _id: '$_id',
          listBoard: { $push: { _id: '$boards._id', title: '$boards.title', slug: '$boards.slug', description: '$boards.description' } }
        }
      },
      {
        $project: {
          listBoard: 1
        }
      }
    ]).toArray()

    return result[0]
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
  PushBoardOwnerIds,
  PullBoardOwnerIds,
  fetchBoardOwnerIds
}

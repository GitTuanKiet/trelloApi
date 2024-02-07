/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from '~/utils/constants'
import { getMongo } from '~/config/mongodb'
import { fixObjectId } from '~/utils/formatters'
import fs from 'fs'
import path from 'path'

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
    validatedData.userId = fixObjectId(validatedData.userId)
    validatedData.boardId = fixObjectId(validatedData.boardId)
    validatedData.columnId = fixObjectId(validatedData.columnId)
    return await getMongo().collection(NameCardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}


const updateCard = async (id, data) => {
  if (data.userId) data.userId = fixObjectId(data.userId)
  if (data.boardId) data.boardId = fixObjectId(data.boardId)
  if (data.columnId) data.columnId = fixObjectId(data.columnId)
  if (data.likes) data.likes = data.likes.map(fixObjectId)
  if (data.favorites) data.favorites = data.favorites.map(fixObjectId)
  try {
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
    const cards = await getMongo().collection(NameCardCollection).find(
      { columnId: fixObjectId(columnId) },
      { projection: { cover: 1 } }
    ).toArray()

    const unlinkPromises = cards.map(card => (card.cover && unlinkCover(card.cover)) || Promise.resolve())

    await Promise.all(unlinkPromises)

    return await getMongo().collection(NameCardCollection).deleteMany({ columnId: fixObjectId(columnId) })
  } catch (error) {
    throw error
  }
}

const destroyCardByBoardId = async (boardId) => {
  try {
    const cards = await getMongo().collection(NameCardCollection).find(
      { boardId: fixObjectId(boardId) },
      { projection: { cover: 1 } }
    ).toArray()

    const unlinkPromises = cards.map(card => (card.cover && unlinkCover(card.cover)) || Promise.resolve())

    await Promise.all(unlinkPromises)

    return await getMongo().collection(NameCardCollection).deleteMany({ boardId: fixObjectId(boardId) })
  } catch (error) {
    throw error
  }
}

const unlinkCover = async (coverPath) => {
  try {
    const filePath = path.join('./', coverPath)
    await fs.promises.unlink(filePath)
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
  userId: Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  boardId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),
  columnId:Joi.string().required().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE),

  title:Joi.string().required().min(3).max(33).trim().strict(),
  description: Joi.string().min(6).max(255).trim().strict(),
  cover: Joi.string().pattern(/^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/),

  likes: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)).default([]),
  favorites: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).messages(OBJECT_ID_MESSAGE)).default([]),
  downloads: Joi.number().default(0),

  createAt:Joi.date().timestamp('javascript').default(Date.now()),
  updateAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})

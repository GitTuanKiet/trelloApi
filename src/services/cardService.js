/* eslint-disable no-useless-catch */
import { CardModel } from '~/models/cardModel'
import { ColumnModel } from '~/models/columnModel'

const InvalidCard = ['_id', 'createAt', 'boardId']

const createCardService = async (data) => {
  try {
    const created = await CardModel.createCard(data)
    await ColumnModel.pushCardOrderIds(data.columnId, created.insertedId)
    return await CardModel.findOneById(created.insertedId)
  } catch (error) {
    throw error
  }
}

const updateCardService = async (id, data) => {
  try {
    for (const key of Object.keys(data)) {
      if (InvalidCard.includes(key)) {
        delete data[key]
      }
    }

    const editCard = {
      ...data,
      updateAt:Date.now()
    }

    return await CardModel.updateCard(id, editCard)
  } catch (error) {
    throw error
  }
}

const destroyCardService = async (id) => {
  try {
    return await CardModel.destroyCard(id)
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createCardService,
  updateCardService,
  destroyCardService
}
/* eslint-disable no-useless-catch */
import { CardModel } from '~/models/cardModel'
import { ColumnModel } from '~/models/columnModel'

const InvalidCard = ['createAt', 'boardId']

const createCardService = async (userId, boardId, data) => {
  const newCard = {
    userId: userId,
    boardId: boardId,
    columnId: data.columnId,
    ...data
  }

  try {
    const created = await CardModel.createCard(newCard)

    const [, cardResult] = await Promise.all([
      ColumnModel.pushCardOrderIds(data.columnId, created.insertedId),
      CardModel.findOneById(created.insertedId)
    ])

    return cardResult
  } catch (error) {
    throw error
  }
}


const updateCardService = async (userId, boardId, data) => {
  for (const key of Object.keys(data)) {
    if (InvalidCard.includes(key)) {
      delete data[key]
    }
  }

  const editCard = {
    userId: userId,
    boardId: boardId,
    columnId: data.columnId,
    ...data,
    updateAt: Date.now()
  }

  try {
    delete editCard._id
    return await CardModel.updateCard(data._id, editCard)
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createCardService,
  updateCardService
}
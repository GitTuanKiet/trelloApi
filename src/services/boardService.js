/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { BoardModel } from '~/models/boardModel'
import { ColumnModel } from '~/models/columnModel'
import { CardModel } from '~/models/cardModel'

const InvalidBoard = ['_id', 'createAt']

const createBoardService = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug:slugify(data.title)
    }
    const created = await BoardModel.createBoard(newBoard)
    return await BoardModel.findOneById(created.insertedId)
  } catch (error) {
    throw error
  }
}

const updateBoardService = async (id, data) => {
  try {
    for (const key of Object.keys(data)) {
      if (InvalidBoard.includes(key)) {
        delete data[key]
      }
    }

    if (data?.title) {
      data.slug = slugify(data.title)
    }

    const editBoard = {
      ...data,
      updateAt:Date.now()
    }

    return await BoardModel.updateBoard(id, editBoard)
  } catch (error) {
    throw error
  }
}

const destroyBoardService = async (id) => {
  try {
    return await BoardModel.destroyBoard(id)
  } catch (error) {
    throw error
  }
}

const getDetailsBoardService = async (id) => {
  try {
    const result = await BoardModel.getDetailsBoard(id)

    if (result.columns && result.cards) {
      delete result._destroy
      delete result.columns._destroy
      delete result.cards._destroy
      result.columns = result.columns.map(column => {
        column.cards = result.cards.filter(card => card.columnId.equals(column._id))
        return column
      })
      delete result.cards
    }

    return result
  } catch (error) {
    throw error
  }
}

const setMoveCardWithoutColumnService = async (data) => {
  try {
    const { cardId, prevColumnId, prevCardOrderIds, nextColumnId, nextCardOrderIds } = data

    await CardModel.updateCard(cardId, { columnId: nextColumnId })

    await ColumnModel.updateColumn(prevColumnId, { cardOrderIds: prevCardOrderIds })

    await ColumnModel.updateColumn(nextColumnId, { cardOrderIds: nextCardOrderIds })

    return {
      message : 'Move card without column successfully'
    }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createBoardService,
  updateBoardService,
  destroyBoardService,
  getDetailsBoardService,
  setMoveCardWithoutColumnService
}
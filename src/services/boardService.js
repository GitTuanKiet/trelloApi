/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { BoardModel } from '~/models/boardModel'
import { ColumnModel } from '~/models/columnModel'
import { CardModel } from '~/models/cardModel'
import { AuthModel } from '~/models/authModel'

const InvalidBoard = ['_id', 'createAt']

const createBoardService = async (userId, data) => {
  const newBoard = {
    userId:userId,
    ...data,
    slug:slugify(data.title)
  }
  try {
    const [user, created] = await Promise.all([
      AuthModel.findOneById(userId),
      BoardModel.createBoard(newBoard)
    ])

    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    }

    const [, , board] = await Promise.all([
      AuthModel.PushBoardOwnerIds(userId, created.insertedId),
      BoardModel.updateBoard(created.insertedId, { members: [userData] }),
      BoardModel.findOneById(created.insertedId)])
    return board
  } catch (error) {
    throw error
  }
}

const updateBoardService = async (userId, boardId, data) => {
  for (const key of Object.keys(data)) {
    if (InvalidBoard.includes(key)) {
      delete data[key]
    }
  }

  if (data.title) {
    data.slug = slugify(data.title)
  }

  const editBoard = {
    userId: userId,
    ...data,
    updateAt:Date.now()
  }

  try {
    return await BoardModel.updateBoard(boardId, editBoard)
  } catch (error) {
    throw error
  }
}

const destroyBoardService = async (userId, boardId) => {
  try {
    const board = await BoardModel.findOneById(boardId)

    if (!board) {
      throw new Error('Board not found')
    }

    if (!board.userId.equals(userId)) {
      throw new Error('Unauthorized')
    }

    const authPromise = AuthModel.PullBoardOwnerIds(userId, boardId)
    const columnPromise = ColumnModel.destroyColumnByBoardId(boardId)
    const cardPromise = CardModel.destroyCardByBoardId(boardId)
    const destroy = BoardModel.destroyBoard(boardId)

    const [, column, card, result] = await Promise.all([authPromise, columnPromise, cardPromise, destroy])

    return { resultDeleted: 'Deleted '+result.deletedCount+' board, '+column.deletedCount+' columns, '+card.deletedCount+' cards' }
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

    const PromiseCard = CardModel.updateCard(cardId, { columnId: nextColumnId })

    const PromisePrevCol = ColumnModel.updateColumn(prevColumnId, { cardOrderIds: prevCardOrderIds })

    const PromiseNextCol = ColumnModel.updateColumn(nextColumnId, { cardOrderIds: nextCardOrderIds })

    await Promise.all([PromiseCard, PromisePrevCol, PromiseNextCol])

    return { result: 'Card moved' }
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
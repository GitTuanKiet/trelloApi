/* eslint-disable no-useless-catch */
import { ColumnModel } from '~/models/columnModel'
import { BoardModel } from '~/models/boardModel'
import { CardModel } from '~/models/cardModel'

const InvalidColumn = ['createAt', 'boardId']

const createColumnService = async (userId, boardId, data) => {
  const newColumn = {
    userId: userId,
    boardId: boardId,
    ...data
  }

  try {
    const created = await ColumnModel.createColumn(newColumn)
    const [, columnResult] = await Promise.all([
      BoardModel.pushColumnOrderIds(boardId, created.insertedId),
      ColumnModel.findOneById(created.insertedId)
    ])
    return columnResult
  } catch (error) {
    throw error
  }
}

const updateColumnService = async (userId, boardId, data) => {
  for (const key of Object.keys(data)) {
    if (InvalidColumn.includes(key)) {
      delete data[key]
    }
  }

  const editColumn = {
    userId: userId,
    boardId: boardId,
    ...data,
    updateAt:Date.now()
  }

  try {
    delete editColumn._id
    return await ColumnModel.updateColumn(data._id, editColumn)
  } catch (error) {
    throw error
  }
}

const destroyColumnService = async (boardId, columnId) => {
  try {
    const [, cardDeleted, columnDelete] = await Promise.all([
      BoardModel.pullColumnOrderIds(boardId, columnId),
      CardModel.destroyCardsByColumnId(columnId),
      ColumnModel.destroyColumn(columnId)
    ])

    return { resultDeleted: 'Deleted ' + columnDelete.deletedCount + ' column, ' + cardDeleted.deletedCount + ' cards !' }
  } catch (error) {
    throw error
  }
}


export const columnService = {
  createColumnService,
  updateColumnService,
  destroyColumnService
}
/* eslint-disable no-useless-catch */
import { ColumnModel } from '~/models/columnModel'
import { BoardModel } from '~/models/boardModel'
import { CardModel } from '~/models/cardModel'

const InvalidColumn = ['_id', 'createAt', 'boardId']

const createColumnService = async (data) => {
  try {
    const created = await ColumnModel.createColumn(data)
    await BoardModel.pushColumnOrderIds(data.boardId, created.insertedId)
    return await ColumnModel.findOneById(created.insertedId)
  } catch (error) {
    throw error
  }
}

const updateColumnService = async (id, data) => {
  try {
    for (const key of Object.keys(data)) {
      if (InvalidColumn.includes(key)) {
        delete data[key]
      }
    }

    const editColumn = {
      ...data,
      updateAt:Date.now()
    }

    return await ColumnModel.updateColumn(id, editColumn)
  } catch (error) {
    throw error
  }
}

const destroyColumnService = async (id) => {
  try {
    await BoardModel.pullColumnOrderIds(id)

    const cardDeleted = await CardModel.destroyCardsByColumnId(id)

    const columnDelete = await ColumnModel.destroyColumn(id)

    return { resultDelete: 'Successfully deleted ' + columnDelete.deletedCount + ' column and ' + cardDeleted.deletedCount + ' cards !' }
  } catch (error) {
    throw error
  }
}


export const columnService = {
  createColumnService,
  updateColumnService,
  destroyColumnService
}
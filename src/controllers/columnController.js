import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const CreateColumnController = async (req, res, next) => {
  try {
    const createColumnService = await columnService.createColumnService(req.body)

    return res.status(StatusCodes.CREATED).json(createColumnService)
  } catch (error) {
    next(error)
  }
}

const UpdateColumnController = async (req, res, next) => {
  try {
    const updateColumnService = await columnService.updateColumnService(req.params.id, req.body)

    return res.status(StatusCodes.OK).json(updateColumnService)
  } catch (error) {
    next(error)
  }
}

const DestroyColumnController = async (req, res, next) => {
  try {
    const destroyColumnService = await columnService.destroyColumnService(req.params.id)

    return res.status(StatusCodes.ACCEPTED).json(destroyColumnService)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  CreateColumnController,
  UpdateColumnController,
  DestroyColumnController
}
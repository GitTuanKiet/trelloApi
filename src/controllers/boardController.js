import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const CreateBoardController = async (req, res, next) => {
  try {
    const createBoardService = await boardService.createBoardService(req.user._id, req.body)

    return res.status(StatusCodes.CREATED).json(createBoardService)
  } catch (error) {
    next(error)
  }
}

const UpdateBoardController = async (req, res, next) => {
  try {
    const updateBoardService = await boardService.updateBoardService(req.user._id, req.params.id, req.body)

    return res.status(StatusCodes.OK).json(updateBoardService)
  } catch (error) {
    next(error)
  }
}

const DestroyBoardController = async (req, res, next) => {
  try {
    const destroyBoardService = await boardService.destroyBoardService(req.user._id, req.params.id)

    return res.status(StatusCodes.ACCEPTED).json(destroyBoardService)
  } catch (error) {
    next(error)
  }
}

const getDetailsBoardController = async (req, res, next) => {
  try {
    const getDetailsBoardService = await boardService.getDetailsBoardService(req.params.id)

    return res.status(StatusCodes.OK).json(getDetailsBoardService)
  } catch (error) {
    next(error)
  }
}

const setMoveCardWithoutColumnController = async (req, res, next) => {
  try {
    const setMoveCardWithoutColumnService = await boardService.setMoveCardWithoutColumnService(req.body)

    return res.status(StatusCodes.OK).json(setMoveCardWithoutColumnService)
  } catch (error) {
    next(error)
  }
}


export const boardController = {
  CreateBoardController,
  UpdateBoardController,
  DestroyBoardController,
  getDetailsBoardController,
  setMoveCardWithoutColumnController
}

import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const CreateCardController = async (req, res, next) => {
  try {
    if (req.file) req.body.cover = req.file.buffer

    const createCardService = await cardService.createCardService(req.user._id, req.params.id, req.body)

    return res.status(StatusCodes.CREATED).json(createCardService)
  } catch (error) {
    next(error)
  }
}

const UpdateCardController = async (req, res, next) => {
  try {
    const updateCardService = await cardService.updateCardService(req.user._id, req.params.id, req.body)

    return res.status(StatusCodes.OK).json(updateCardService)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  CreateCardController,
  UpdateCardController
}
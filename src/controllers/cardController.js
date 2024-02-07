import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const CreateCardController = async (req, res, next) => {
  try {
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

const ActionCardController = async (req, res, next) => {
  try {
    const actionCardService = await cardService.actionCardService(req.user._id, req.params.cardId, req.body)

    return res.status(StatusCodes.OK).json(actionCardService)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  CreateCardController,
  UpdateCardController,
  ActionCardController
}
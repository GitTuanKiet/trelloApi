import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const CreateCardController = async (req, res, next) => {
  try {
    const createCardService = await cardService.createCardService(req.body)

    return res.status(StatusCodes.CREATED).json(createCardService)
  } catch (error) {
    next(error)
  }
}

const UpdateCardController = async (req, res, next) => {
  try {
    const updateCardService = await cardService.updateCardService(req.params.id, req.body)

    return res.status(StatusCodes.OK).json(updateCardService)
  } catch (error) {
    next(error)
  }
}

const DestroyCardController = async (req, res, next) => {
  try {
    const destroyCardService = await cardService.destroyCardService(req.params.id)

    return res.status(StatusCodes.ACCEPTED).json(destroyCardService)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  CreateCardController,
  UpdateCardController,
  DestroyCardController
}
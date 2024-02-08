import { StatusCodes } from 'http-status-codes'
import { UserService } from '~/services/userService'

const getListUserController = async (req, res, next) => {
  try {
    const getListUserService = await UserService.getListUserService()

    return res.status(StatusCodes.OK).json(getListUserService)
  } catch (error) {
    next(error)
  }
}

const inviteMemberController = async (req, res, next) => {
  try {
    const inviteMemberService = await UserService.inviteMemberService(req.user._id, req.body.board, req.body.user)

    return res.status(StatusCodes.OK).json(inviteMemberService)
  } catch (error) {
    next(error)
  }
}

const removeMemberController = async (req, res, next) => {
  try {
    const removeMemberService = await UserService.removeMemberService(req.user._id, req.body.board, req.body.user)

    return res.status(StatusCodes.ACCEPTED).json(removeMemberService)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getListUserController,
  inviteMemberController,
  removeMemberController
}
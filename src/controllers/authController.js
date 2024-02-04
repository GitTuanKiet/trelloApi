import { StatusCodes } from 'http-status-codes'
import { AuthService } from '~/services/authService'
import Jwt from 'jsonwebtoken'
import { ENV } from '~/config/environment'
const { SECRET_KEY, EXPIRES_IN } = ENV

const loginController = async (req, res, next) => {
  try {
    if (req.user) {
      const token = Jwt.sign({ id: req.user._id }, SECRET_KEY, { expiresIn: EXPIRES_IN })
      return res.status(StatusCodes.OK).json({ token })
    }

    const loginData = await AuthService.loginService(req.body)

    return res.status(StatusCodes.OK).json(loginData)
  } catch (error) {
    next(error)
  }
}

const registerController = async (req, res, next) => {
  try {
    const registerData = await AuthService.registerService(req.body)

    return res.status(StatusCodes.CREATED).json(registerData)
  } catch (error) {
    next(error)
  }
}

const forgotPasswordController = async (req, res, next) => {
  try {
    const forgotPasswordData= await AuthService.forgotPasswordService(req.body)

    return res.status(StatusCodes.OK).json(forgotPasswordData)
  } catch (error) {
    next(error)
  }
}

const logoutController = async (req, res, next) => {
  try {
    if (req.user) {
      await AuthService.logoutService(req.user.id)
      return res.status(StatusCodes.OK).json({ message: 'Logout successfully' })
    }

    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ID is required' })
  } catch (error) {
    next(error)
  }
}

const updateController = async (req, res, next) => {
  try {
    const updateData = await AuthService.updateAuthService(req.user.id, req.body)

    return res.status(StatusCodes.OK).json(updateData)
  } catch (error) {
    next(error)
  }
}

const updatePasswordController = async (req, res, next) => {
  try {
    const updatePasswordData = await AuthService.updatePasswordService(req.user.id, req.body)

    return res.status(StatusCodes.OK).json(updatePasswordData)
  } catch (error) {
    next(error)
  }
}

const getListBoardController = async (req, res, next) => {
  try {
    const listBoardData = await AuthService.getListBoardService(req.user.id)

    return res.status(StatusCodes.OK).json(listBoardData)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  loginController,
  registerController,
  forgotPasswordController,
  logoutController,
  updateController,
  updatePasswordController,
  getListBoardController
}
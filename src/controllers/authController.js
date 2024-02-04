import { StatusCodes } from 'http-status-codes'
import { AuthService } from '~/services/authService'

const loginController = async (req, res, next) => {
  try {
    if (req.user) {
      delete req.user
      return res.status(StatusCodes.OK).json({ token: null, user: null })
    }

    const loginData = await AuthService.loginService(req.body)

    return res.status(StatusCodes.OK).json(loginData)
  } catch (error) {
    next(error)
  }
}

const registerController = async (req, res, next) => {
  try {
    if (req.user) {
      delete req.user
      return res.status(StatusCodes.OK).json({ token: null, user: null })
    }

    const registerData = await AuthService.registerService(req.body)

    return res.status(StatusCodes.CREATED).json(registerData)
  } catch (error) {
    next(error)
  }
}

const forgotPasswordController = async (req, res, next) => {
  try {
    if (req.user) {
      delete req.user
      return res.status(StatusCodes.OK).json({ token: null, user: null })
    }

    const forgotPasswordData = await AuthService.forgotPasswordService(req.body)

    return res.status(StatusCodes.OK).json(forgotPasswordData)
  } catch (error) {
    next(error)
  }
}

const logoutController = async (req, res, next) => {
  try {
    delete req.user
    return res.status(StatusCodes.OK).json({ token: null, user: null })
  } catch (error) {
    next(error)
  }
}

const updateController = async (req, res, next) => {
  try {
    const updateData = await AuthService.updateAuthService(req.user._id, req.body)

    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.OK).json(req.body)
    }

    return res.status(StatusCodes.OK).json(updateData)
  } catch (error) {
    next(error)
  }
}

const updatePasswordController = async (req, res, next) => {
  try {
    const updatePasswordData = await AuthService.updatePasswordService(req.user._id, req.body)

    return res.status(StatusCodes.OK).json(updatePasswordData)
  } catch (error) {
    next(error)
  }
}

const getListBoardController = async (req, res, next) => {
  try {
    const listBoardData = await AuthService.getListBoardService(req.user._id)

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
import express from 'express'
import { authValidator } from '~/validators/authValidator'
import { authController } from '~/controllers/authController'

const router = express.Router()

router.route('/get-list-board')
  .get(require('~/middlewares/verifyJWT'), authController.getListBoardController)

router.route('/update-profile')
  .post(require('~/middlewares/verifyJWT'), authValidator.updateValidation, authController.updateController)

router.route('/update-password')
  .post(require('~/middlewares/verifyJWT'), authValidator.updatePasswordValidation, authController.updatePasswordController)

router.route('/register')
  .post(authValidator.registerValidation, authController.registerController)

router.route('/login')
  .post(authValidator.loginValidation, authController.loginController)

router.route('/forgot-password')
  .post(authValidator.forgotPasswordValidation, authController.forgotPasswordController)

router.route('/logout')
  .get(require('~/middlewares/verifyJWT'), authController.logoutController)

// router.route('/refresh-token')
//   .post(authController.refreshTokenController)

module.exports = router
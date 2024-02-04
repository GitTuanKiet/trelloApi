import express from 'express'
import { authValidator } from '~/validators/authValidator'
import { authController } from '~/controllers/authController'

const router = express.Router()

router.route('/register')
  .post(authValidator.registerValidation, authController.registerController)

router.route('/login')
  .post(authValidator.loginValidation, authController.loginController)

router.route('/forgot-password')
  .post(authValidator.forgotPasswordValidation, authController.forgotPasswordController)

router.use(require('~/middlewares/verifyJWT'))

router.route('/get-list-board')
  .get(authController.getListBoardController)

router.route('/update-profile')
  .post(authValidator.updateValidation, authController.updateController)

router.route('/update-password')
  .post(authValidator.updatePasswordValidation, authController.updatePasswordController)

router.route('/logout')
  .get(authController.logoutController)

// router.route('/refresh-token')
//   .post(authController.refreshTokenController)

module.exports = router
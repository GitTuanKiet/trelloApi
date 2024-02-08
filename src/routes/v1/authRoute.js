import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { authValidator } from '~/validators/authValidator'
import { authController } from '~/controllers/authController'

const maxSize = 2*1024*1024
const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/svg+xml') {
      return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
  },
  destination: function (req, file, cb) {
    const folder = 'uploads/'

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }

    cb(null, folder)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname +'_'+ Date.now() + '_' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: maxSize }
})

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
  .post(upload.single('avatar'), authValidator.updateValidation, authController.updateController)

router.route('/update-password')
  .post(authValidator.updatePasswordValidation, authController.updatePasswordController)

router.route('/logout')
  .get(authController.logoutController)

// router.route('/refresh-token')
//   .post(authController.refreshTokenController)

module.exports = router
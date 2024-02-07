import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { cardValidator } from '~/validators/cardValidator'
import { cardController } from '~/controllers/cardController'

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

router.route('/create/:id')
  .post(upload.single('cover'), cardValidator.createCardValidation, cardController.CreateCardController)

router.route('/:id')
  .put(cardValidator.updateCardValidation, cardController.UpdateCardController)

router.route('/action/:cardId')
  .put(cardController.ActionCardController)

module.exports = router
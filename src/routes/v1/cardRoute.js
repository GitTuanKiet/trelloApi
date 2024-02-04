import express from 'express'
import multer from 'multer'
import { cardValidator } from '~/validators/cardValidator'
import { cardController } from '~/controllers/cardController'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.route('/create/:id')
  .post(upload.single('cover'), cardValidator.createCardValidation, cardController.CreateCardController)

router.route('/:id')
  .put(cardValidator.updateCardValidation, cardController.UpdateCardController)

module.exports = router
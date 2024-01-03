import express from 'express'
import { cardValidator } from '~/validators/cardValidator'
import { cardController } from '~/controllers/cardController'

const router = express.Router()

router.route('/create')
  .post(cardValidator.createCardValidation, cardController.CreateCardController)

router.route('/:id')
  .put(cardValidator.updateCardValidation, cardController.UpdateCardController)
  .delete(cardController.DestroyCardController)

module.exports = router
import express from 'express'
import { boardValidator } from '~/validators/boardValidator'
import { boardController } from '~/controllers/boardController'

const router = express.Router()

router.route('/create')
  .post(boardValidator.createBoardValidation, boardController.CreateBoardController)

router.route('/:id')
  .get(boardController.getDetailsBoardController)
  .put(boardValidator.updateBoardValidation, boardController.UpdateBoardController)

router.route('/delete/:id')
  .delete(boardController.DestroyBoardController)

router.route('/move')
  .post(boardValidator.setMoveCardWithoutColumnValidator, boardController.setMoveCardWithoutColumnController)

module.exports = router

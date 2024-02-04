import express from 'express'
import { boardValidator } from '~/validators/boardValidator'
import { boardController } from '~/controllers/boardController'

const router = express.Router()

router.route('/create')
  .post(require('~/middlewares/verifyJWT'), boardValidator.createBoardValidation, boardController.CreateBoardController)

router.route('/:id')
  .get(boardController.getDetailsBoardController)
  .put(boardValidator.updateBoardValidation, boardController.UpdateBoardController)
  .delete(require('~/middlewares/verifyJWT'), boardController.DestroyBoardController)

router.route('/move')
  .post(boardValidator.setMoveCardWithoutColumnValidator, boardController.setMoveCardWithoutColumnController)

module.exports = router
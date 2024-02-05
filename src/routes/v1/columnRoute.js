import express from 'express'
import { columnValidator } from '~/validators/columnValidator'
import { columnController } from '~/controllers/columnController'

const router = express.Router()

router.route('/create/:id')
  .post(columnValidator.createColumnValidation, columnController.CreateColumnController)

router.route('/:id')
  .put(columnValidator.updateColumnValidation, columnController.UpdateColumnController)

router.route('/delete/:boardId&&:columnId')
  .delete(columnController.DestroyColumnController)

module.exports = router
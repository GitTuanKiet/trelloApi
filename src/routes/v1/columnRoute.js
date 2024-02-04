import express from 'express'
import { columnValidator } from '~/validators/columnValidator'
import { columnController } from '~/controllers/columnController'

const router = express.Router()

router.route('/create/:id')
  .post(columnValidator.createColumnValidation, columnController.CreateColumnController)

router.route('/:id')
  .put(columnValidator.updateColumnValidation, columnController.UpdateColumnController)
  .delete(columnController.DestroyColumnController)

module.exports = router
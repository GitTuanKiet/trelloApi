import express from 'express'
import { userController } from '~/controllers/userController'

const router = express.Router()

router.route('/get-list-user')
  .get(userController.getListUserController)

router.use(require('~/middlewares/verifyJWT'))

router.route('/invite-member')
  .post(userController.inviteMemberController)

router.route('/remove-member')
  .post(userController.removeMemberController)

module.exports = router
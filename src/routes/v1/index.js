import express from 'express'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello world!'
  })
})


router.use('/auth', require('./authRoute'))
router.use(require('~/middlewares/verifyJWT'))
router.use('/boards', require('./boardRoute'))
router.use('/columns', require('./columnRoute'))
router.use('/cards', require('./cardRoute'))

module.exports = router
/* eslint-disable no-console */
import express from 'express'
import { connectMongo, disconnectMongo } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { ENV } from '~/config/environment'

const { PORT, HOST, AUTHOR } = ENV

const START_SERVER = () => {
  const app = express()

  app.use(express.json())

  app.use(require('~/config/cors'))

  app.use('/v1', require('~/routes/v1'))

  app.use(require('~/middlewares/errorHandler'))

  app.listen(PORT, HOST, () => {
    console.log(`Server started at http://${HOST}:${PORT}`)
    console.log(`Author: ${AUTHOR}`)
  })

  exitHook(() => {
    disconnectMongo()
  })
}

(async () => {
  try {
    await connectMongo()
    START_SERVER()
  } catch (error) {
    console.error('Error starting server: ', error)
    process.exit(1)
  }
})()



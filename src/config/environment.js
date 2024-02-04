import 'dotenv/config'

export const ENV = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  SECRET_KEY: process.env.SECRET_KEY,
  EXPIRES_IN: process.env.EXPIRES_IN,

  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB: process.env.MONGO_DB,

  NODE_ENV: process.env.NODE_ENV,

  AUTHOR: process.env.AUTHOR
}


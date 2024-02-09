export const DOMAINS = [
  'http://localhost:5173',
  'https://trello-web-tau.vercel.app',
  'https://master.d1t3njxi26pe4b.amplifyapp.com'
]

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/

export const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }

import bcrypt from 'bcryptjs'

export const isBcryptHash = (value, helpers) => {
  if (!bcrypt.getRounds(value)) {
    return helpers.error('password.invalidHash')
  }
  return value
}
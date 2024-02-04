// Example code to verify and decode JWT on the server side (Node.js)
import jwt from 'jsonwebtoken'
import { ENV } from '~/config/environment'
const { SECRET_KEY } = ENV

function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' })
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' })
    }

    req.user = decoded

    next()
  })
}

module.exports = verifyToken
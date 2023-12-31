import express from 'express'

const app = express()

const PORT = 3000
const HOST = 'localhost'

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
})


import express from 'express'
import path from 'path'
import { CardModel } from '~/models/cardModel'

const router = express.Router()

router.route('/uploads/:file')
  .get((req, res) => {
    res.sendFile(req.params.file, { root: 'uploads' })
  })

router.route('/download/:filename&&:cardId')
  .get(async (req, res) => {
    const { filename, cardId } = req.params
    await CardModel.findOneById(cardId).then(card => {
      if (card) {
        CardModel.updateCard(cardId, { downloads: ++card.downloads })
      }
    })
    const filePath = path.join('./uploads', filename)
    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error')
      }
    })
  })

module.exports = router
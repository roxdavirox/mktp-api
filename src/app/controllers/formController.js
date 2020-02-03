/* eslint-disable no-underscore-dangle */
const express = require('express')
const Product = require('../models/product')

const router = express.Router()

router.get('/:productId', async (req, res) => {
  try {
    const { medidas, itemSelecionadoId } = req.body
    const product = await Product
      .findById(req.params.productId)
      .populate([
        {
          path: 'templatesCategory',
          populate: {
            path: 'productTemplates',
          },
        },
        {
          path: 'productOptions.option',
        },
        {
          path: 'productOptions.item',
        },
      ])

    const html = `
    <html>
    <body>
      <div>
        <h1>Produto:</h1>
        <h2>${product.name}</h2>
        <h1>Opções</h1>
        <h2>${product.productOptions[0].option.name}</h2>
        <ul>
          ${product.productOptions.reduce((_li, op) => _li.concat(`<li>${op.item.name}</li>`), '')}
        </ul>
      </div>
    </body>
    </html>
    `

    return res.send({ html, product })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product form: ${e}` })
  }
})

module.exports = (app) => app.use('/form', router)

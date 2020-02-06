/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
const express = require('express')
const Product = require('../models/product')

const router = express.Router()

router.get('/:productId', async (req, res) => {
  try {
    // const {
    //     medidas,
    //     itemSelecionadoId,
    //     materialSelecionadoId,
    //     quantidade,
    //   } = req.body

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

    const getUnique = (arr) => [...new Set(arr)]

    const optionsIds = product.productOptions.map((po) => po.option._id)
    const options = product.productOptions.map((po) => po.option)
    const uniqueOptions = getUnique(options)
      .reduce((all, op) => ({ ...all, [op._id]: op }), {})
    const uniqueOptionsIds = getUnique(optionsIds)

    const _options = {}
    uniqueOptionsIds.forEach((id) => {
      const items = product
        .productOptions
        .filter((po) => po.option._id === id)
        .map((po) => po.item)
      const option = { ...uniqueOptions[id].toObject() }

      _options[id] = { ...option, items }
    })

    const getHtmlString = (view, props) => new Promise((resolve, _) => {
        res.render(view, props, (err, html) => {
          if (err) _(err)
          resolve(html)
        })
      })

    const html = await getHtmlString('form', { product, options: _options })
    return res.send({ html, price: 'R$ 200' })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product form: ${e}` })
  }
})

module.exports = (app) => app.use('/form', router)

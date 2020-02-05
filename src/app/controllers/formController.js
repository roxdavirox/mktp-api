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

      _options[id] = { option, items }
    })

    // const lis = Object.keys(groupedOptions)
    //   .map((k) => groupedOptions[k])
    //   .map((op) => `<p>${op.name}:
    //     <select>${
    //       op.items.map((it) => `<option ${it._id == itemSelecionadoId || it._id == materialSelecionadoId ? 'selected' : ''}>${it.name}</option>`)
    //         .reduce((_, li) => _.concat(`${li}`), '')}
    //     </select></p>`)
    //   .reduce((_, li) => _.concat(`${li}`), '')

    // const range = (q) => {
    //   const arr = []
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 1; i <= q; i++) arr.push(i)
    //   return arr
    // }

    // const html = `
    // <html>
    // <body>
    //   <div>
    //     <h2>Produto: ${product.name}</h2>
    //     <p>Quantidade
    //       <select>
    //         ${range(quantidade).reduce((_, q) => _.concat(`<option>${q}</option>`), '')}
    //       </select>
    //     </p>
    //     <p>Medidas:
    //       <select>
    //         ${medidas.reduce((_li, m) => _li.concat(`<option>${m}</option>`), '')}
    //       </select>
    //     </p>
    //     ${lis}
    //   </div>
    //   <div id="orcamento">
    //     <form>
    //       <label>Nome: <input type="text" name="nome"></label><br />
    //       <label>E-mail:<input type="text" name="email"></label><br />
    //       <label>Telefone<input type="text" name="telefone"></label><br />
    //     </form>
    //   </div>
    //   <div id="preco">
    //     R$ 10,00
    //   </div>
    //   <input type="submit" value="fazer orçamento" onclick="fazerOrcamento()">
    // </body>
    // </html>
    // `

    return res.send({ product, options: _options })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product form: ${e}` })
  }
})

module.exports = (app) => app.use('/form', router)

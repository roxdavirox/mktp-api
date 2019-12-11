const express = require('express')

const PriceTable = require('../models/priceTable')
const Price = require('../models/price')

const router = express.Router()

const createNewPriceTable = async (req, res) => {
  try {
    const { name, unit } = req.body

    const priceTable = await PriceTable.create({ name, unit })

    return res.send({ priceTable })
  } catch (e) {
    return res.status(400)
      .send({ erro: `Error on post new price table: ${e}` })
  }
}

const calculatePriceByArea = async (req, res) => {
  try {
    const { priceTableId } = req.params
    const { quantity } = req.body
    const { size = { x: 1, y: 1 } } = req.body
    let total = quantity

    const priceTable = await PriceTable.findById(priceTableId)
      .populate('prices')

    if (priceTable.unit !== 'quantidade') {
      total *= size.x * size.y
    }

    const { prices } = priceTable
    const preco = prices.find((price) => (price.start <= total && total <= price.end))

    if (!preco) {
      const lastPrice = prices[prices.length - 1]
      total *= lastPrice.value
      return res.send({
        total,
      })
    }

    total *= preco.value

    return res.send({
      total,
    })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` })
  }
}

const getPriceTables = async (req, res) => {
  try {
    const priceTables = await PriceTable.find().select('-prices')

    return res.send({ priceTables })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` })
  }
}

const getPricesByPriceTableId = async (req, res) => {
  try {
    const { priceTableId } = req.params

    const priceTable = await PriceTable
      .findById(priceTableId)
      .populate('prices')
      .select('+prices')

    return res.send({ priceTable })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` })
  }
}

const deleteManyPriceTablesByIds = async (req, res) => {
  try {
    const { priceTableIds } = req.body

    await PriceTable.deleteMany({ _id: { $in: priceTableIds } })

    return res.send({ deletedCount: priceTableIds.length })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on delete price tables: ${e}` })
  }
}

const createPriceTableChild = async (req, res) => {
  try {
    const { priceTableId } = req.params
    const { price } = req.body

    const priceTable = await PriceTable
      .findById(priceTableId).populate('prices')

    const p = await Price.create({ ...price, priceTable: priceTableId })

    priceTable.prices.push(p)

    await priceTable.save()

    return res.send({ price: p })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on update price table with new child: ${e}` })
  }
}

router.post('/', createNewPriceTable)
router.post('/total-area/:priceTableId', calculatePriceByArea)
router.post('/total/:priceTableId', calculatePriceByArea)
router.get('/', getPriceTables)
router.get('/:priceTableId', getPricesByPriceTableId)
router.delete('/', deleteManyPriceTablesByIds)
router.put('/:priceTableId', createPriceTableChild)

module.exports = (app) => app.use('/price-tables', router)

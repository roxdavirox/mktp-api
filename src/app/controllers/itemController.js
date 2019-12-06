/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express')

const Item = require('../models/item')
const Option = require('../models/option')
const Price = require('../models/price')

const router = express.Router()
// TODO: remover funções relacionadas a itens existentes
const createItemWithoutOption = async (req, res) => {
  const { name, priceTableId } = req.body

  try {
    const newItem = {
      name,
      priceTableId:
      // eslint-disable-next-line eqeqeq
      priceTableId == '0' ? undefined : priceTableId,
    }
    const item = await Item.create({ ...newItem })

    return res.send({ item })
  } catch (e) {
    return res.status(400).send({ error: 'Error on creating a item' })
  }
}

const createItemIntoOptions = async (req, res) => {
  try {
    const { optionId } = req.params

    const option = await Option.findById(optionId).populate('items')

    const { name, priceTableId } = req.body
    const newItem = {
      name,
      itemType: 'item',
      priceTableId:
      // eslint-disable-next-line eqeqeq
      priceTableId == '0' ? undefined : priceTableId,
      option: optionId,
    }

    const item = await Item.create({ ...newItem })

    option.items.push(item)
    await option.save()

    return res.send({ item })
  } catch (err) {
    return res.status(400).send({ error: "Error on add option's item" })
  }
}

const createTemplateItem = async (req, res) => {
  try {
    const { optionId } = req.params

    const option = await Option.findById(optionId).populate('items')

    const { name, options } = req.body
    const templateItem = {
      name,
      itemType: 'template',
      priceTableId: undefined,
      templateOptions: options,
      option: optionId,
    }

    const item = await Item.create({ ...templateItem })

    option.items.push(item)

    await option.save()

    return res.send({ templateItem: item })
  } catch (err) {
    return res.status(400).send({ error: "Error on add option's item" })
  }
}

const updateItemById = async (req, res) => {
  try {
    const { itemId } = req.params

    const { name, priceTableId } = req.body
    const newItem = {
      name,
      priceTableId:
      // eslint-disable-next-line eqeqeq
      priceTableId == '0' ? undefined : priceTableId,
    }

    const item = await Item
      .findByIdAndUpdate(
        itemId,
        { ...newItem },
        { new: true },
      )

    return res.send({ item })
  } catch (e) {
    return res.status(400)
      .send({ error: 'Error on update item' })
  }
}

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()

    return res.send({ items })
  } catch (e) {
    return res.status(400).send({ error: 'Error on load all items' })
  }
}

const calculateItemPrice = async (templateItem) => {
  const { quantity, size = { x: 1, y: 1 } } = templateItem
  if (!templateItem.item) return 0
  const item = await Item.findById(templateItem.item._id)
    .populate({
      path: 'option',
    })
    .populate({ path: 'templateOptions.item' })

  const { priceTableId, itemType } = item
  let total = Number(quantity * size.x * size.y)

  if (itemType === 'template' && item.templateOptions) {
    total *= Number(await Promise.resolve(
      item.templateOptions
        .reduce(async (acc, _item) => await acc + await calculateItemPrice(_item), 0),
    ))
    return total
  }

  const _price = await Price.findOne({
    priceTable: priceTableId,
    start: { $lt: total },
    end: { $gt: total },
  })

  if (!_price) {
    const prices = await Price
      .find({ priceTable: priceTableId })
      .sort({ _id: -1 })
      .limit(1)

    const [lastPrice] = prices
    total *= lastPrice.value
    return total
  }

  total = Number(_price.value) * Number(total)
  return total
}

const getItemsWithOption = async (req, res) => {
  try {
    const items = await Item.find().populate({
      path: 'option',
    }).populate({
      path: 'priceTableId',
      select: 'unit',
    }).populate({ path: 'templateOptions.item' })

    // eslint-disable-next-line no-underscore-dangle
    const _items = await Promise.all(items.map(async (item) => {
      if (item.itemType === 'template' && item.templateOptions) {
        const itemPrice = await item.templateOptions
          .reduce(async (acc, _item) => await acc + await calculateItemPrice(_item), 0)
        return { ...item.toObject(), itemPrice }
      }
      return item
    }))

    return res.send({ items: _items })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get items with price table ${e}` })
  }
}

const getItemById = async (req, res) => {
  try {
    const item = await Item
      .findById(req.params.itemId)
      .populate({
        path: 'templateOptions.item',
      })

    return res.send({ item })
  } catch (e) {
    return res.status(400).send({ error: 'Error on load items' })
  }
}

const deleteManyItemsByIds = async (req, res) => {
  try {
    const { itemsId } = req.body

    await Item.deleteMany({ _id: { $in: itemsId } })

    return res.send({ deletedItemsCount: itemsId.length })
  } catch (e) {
    return res.status(400).send({ error: `Error on deleting item(s): ${e}` })
  }
}

const removeOptionsItemsWithoutDeleteFromDB = async (req, res) => {
  try {
    const { optionId } = req.params

    const { itemsId } = req.body

    const option = await Option.findById(optionId)

    if (itemsId) {
      itemsId.forEach((id) => option.items.pull(id))
      await option.save()
    }
    if (itemsId) {
      await Item.deleteMany({ _id: { $in: itemsId } })
    }
    return res.send({ deletedItemsCount: itemsId.length })
  } catch (e) {
    return res.status(400).send({ error: `Error on deleting option item(s): ${e}` })
  }
}

router.post('/', createItemWithoutOption)
router.post('/:optionId', createItemIntoOptions)
router.post('/templates/:optionId', createTemplateItem)
router.put('/:itemId', updateItemById)
router.get('/', getAllItems)
router.get('/templates', getItemsWithOption)
router.get('/:itemId', getItemById)
router.delete('/', deleteManyItemsByIds)
// deleta os itens de uma opção, mas sem excluir do banco de dados
router.delete('/:optionId', removeOptionsItemsWithoutDeleteFromDB)

module.exports = (app) => app.use('/items', router)

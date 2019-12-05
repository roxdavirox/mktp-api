const express = require('express')

const Option = require('../models/option')
const Item = require('../models/item')

const router = express.Router()

const createOption = async (req, res) => {
  try {
    const option = await Option.create(req.body)

    return res.send({ option })
  } catch (e) {
    return res.status(400).send({ error: 'Error when try to create a option' })
  }
}

const getAllOptions = async (req, res) => {
  try {
    const options = await Option.find()
      .populate({
        path: 'items',
      })

    return res.send({ options })
  } catch (e) {
    return res.status(400).send({ error: 'Error on load options' })
  }
}

const updateItemIntoOptions = async (req, res) => {
  try {
    const { optionId, itemId } = req.body

    const option = await Option.findById(optionId).populate('items')

    const item = await Item.findById(itemId)

    option.items.pull(itemId)

    option.items.push(item)

    await option.save()

    return res.send({ option })
  } catch (err) {
    return res.status(400).send({ error: 'Error on update option' })
  }
}

const deleteManyOptionsAndChildItemsByIds = async (req, res) => {
  try {
    const { optionsId } = req.body
    const options = await Option.find({ _id: { $in: optionsId } })
    const itemsId = options
      .reduce((allItemsId, crrOption) => [...allItemsId, ...crrOption.items], [])
    await Option.deleteMany({ _id: { $in: optionsId } })
    await Item.deleteMany({ _id: { $in: itemsId } })
    return res.send({ deletedOptionsCount: optionsId.length })
  } catch (e) {
    return res.status(400).send({ error: `Error on deleting option(s): ${e}` })
  }
}

router.post('/', createOption)
router.get('/', getAllOptions)
router.put('/', updateItemIntoOptions)
router.delete('/', deleteManyOptionsAndChildItemsByIds)

module.exports = (app) => app.use('/options', router)

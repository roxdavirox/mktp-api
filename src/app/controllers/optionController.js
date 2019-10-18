const express = require('express');

const Option = require('../models/option');
const Item = require('../models/item');

const router = express.Router();

const createOption = async (req, res) => {
  try {
    const option = await Option.create(req.body);

    return res.send({ option });
  } catch (e) {
    return res.status(400).send({ error: 'Error when try to create a option' });
  }
};

const getAllOptions = async (req, res) => {
  try {
    const options = await Option.find()
      .populate({
        path: 'items',
        populate: {
          path: 'priceTableId',
          select: 'unit',
        },
      });

    return res.send({ options });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load options' });
  }
};

const updateItemIntoOptions = async (req, res) => {
  try {
    const { optionId, itemId } = req.body;

    const option = await Option.findById(optionId).populate('items');

    const item = await Item.findById(itemId);

    option.items.pull(itemId);

    option.items.push(item);

    await option.save();

    return res.send({ option });
  } catch (err) {
    return res.status(400).send({ error: 'Error on update option' });
  }
};

const addExistingItemsIntoOptions = async (req, res) => {
  try {
    const { optionId } = req.params;
    const { itemsId } = req.body;

    const option = await Option
      .findOneAndUpdate({ _id: optionId }, {
        $addToSet: { items: { $each: itemsId } },
      });

    await option.save();

    return res.send({ itemsCount: itemsId.length });
  } catch (err) {
    return res.status(400)
      .send({ error: 'Error on add existing items into option' });
  }
};

const deleteManyOptionsByIds = async (req, res) => {
  try {
    const { optionsId } = req.body;

    await Option.deleteMany({ _id: { $in: optionsId } });

    return res.send({ deletedOptionsCount: optionsId.length });
  } catch (e) {
    return res.status(400).send({ error: `Error on deleting option(s): ${e}` });
  }
};

router.post('/', createOption);
router.get('/', getAllOptions);
router.put('/', updateItemIntoOptions);
router.put('/:optionId', addExistingItemsIntoOptions);
router.delete('/', deleteManyOptionsByIds);

module.exports = (app) => app.use('/options', router);

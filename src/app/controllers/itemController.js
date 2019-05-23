const express = require('express');

const Item = require('../models/item');
const Price = require('../models/price');
const Option = require('../models/option');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, price } = req.body;

  try {
    const item = await Item.create({ name });
    
    if (price) {
      const priceItem = await Price.create(price);
      item.price = priceItem;
    }

    await item.save();

    return res.send({ item });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: 'Error on creating a item'});
  }
});

router.post('/:optionId', async (req, res) => {
  try {
    const { optionId } = req.params;

    const { name } = req.body;
    
    const option = await Option.findById(optionId).populate('items');
    
    const item = await Item.create({ name });

    option.items.push(item);

    await option.save();

    return res.send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error on add option's item"});
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('price');

    return res.send({ items });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load items'});    
  }
});

router.delete('/', async (req, res) => {
  try {
    const { itemsId } = req.body;

    await Item.deleteMany({ _id:{ $in: itemsId }});

    return res.send({ deletedItemsCount: itemsId.length });
  } catch(e) {
    return res.status(400).send({ error: `Error on deleting item(s): ${e}`});
  }
});

module.exports = app => app.use('/items', router);

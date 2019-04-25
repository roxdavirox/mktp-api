const express = require('express');

const Item = require('../models/item');
const Price = require('../models/price');

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

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('price');

    return res.send({ items });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load items'});    
  }
});

module.exports = app => app.use('/items', router);

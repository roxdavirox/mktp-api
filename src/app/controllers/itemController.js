const express = require('express');

const Item = require('../models/item');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    console.log(item);
    return res.send({ item });
  } catch (e) {
    return res.status(400).send({ error: 'Error on creating a item'});
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();

    return res.send({ items });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load items'});    
  }
});

module.exports = app => app.use('/items', router);

const express = require('express');

const Option = require('../models/option');
const Item = require('../models/item');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const option = await Option.create(req.body);

    return res.send({ option });
  } catch (e) {
    return res.status(400).send({ error: 'Error when try to create a option'});
  }
});

router.get('/', async (req, res) => {
  try {
    const options = await Option.find().populate('items');

    return res.send({ options });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load options'});    
  }
});

router.put('/', async (req, res) => {
  try {
    const { optionId, itemId } = req.body;
    
    const option = await Option.findById(optionId).populate('items');
    
    const item = await Item.findById(itemId);

    option.items.pull(itemId);

    option.items.push(item);

    await option.save();

    return res.send({ option });
  } catch (err) {
    return res.status(400).send({ error: 'Error on update option'});
  }
});

module.exports = app => app.use('/options', router);

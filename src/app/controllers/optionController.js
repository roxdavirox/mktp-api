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

router.put('/:optionId', async (req, res) => {
  try {
    const { optionId } = req.params;
    console.log('put optionId:', optionId);
    const { itemsId } = req.body;
    console.log('ids dos itens:', itemsId);
    
    const option = await Option.findOneAndUpdate({ _id: optionId }, { 
        $addToSet: { items: { $each: itemsId } }
      }
    );

    await option.save();

    return res.send({ itemsCount: itemsId.length });
  } catch (err) {
    return res.status(400)
      .send({ error: 'Error on add existing items into option'});
  }
});

router.delete('/', async (req, res) => {
  try {
    const { optionsId } = req.body;

    await Option.deleteMany({ _id:{ $in: optionsId }});

    return res.send({ deletedOptionsCount: optionsId.length });
  } catch(e) {
    return res.status(400).send({ error: `Error on deleting option(s): ${e}`});
  }
});

module.exports = app => app.use('/options', router);

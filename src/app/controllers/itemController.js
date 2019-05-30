const express = require('express');

const Item = require('../models/item');
const Option = require('../models/option');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, price } = req.body;

  try {
    const item = await Item.create({ name });
    
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

    item.options.push(optionId);

    await item.save();

    option.items.push(item);

    await option.save();

    return res.send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error on add option's item"});
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();//.populate('options');

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

// deleta os itens de uma opção, mas sem excluir do banco de dados
router.put('/:optionId', async (req, res) => {
  try {
    const { optionId } = req.params;

    const { itemsId } = req.body;

    const option = await Option.findById(optionId);

    if (itemsId) {
      itemsId.forEach(id => option.items.pull(id));
      await option.save();
    }
    
    console.log('itemsId:', itemsId);
    console.log('optionId:', optionId);
    console.log('optionItems:', option.items);


    return res.send({ deletedItemsCount: itemsId.length });
  } catch(e) {
    return res.status(400).send({ error: `Error on deleting option item(s): ${e}`});
  }
})

module.exports = app => app.use('/items', router);

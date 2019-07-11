const express = require('express');

const Product = require('../models/product');
const Option = require('../models/option');
const Item = require('../models/item');
const Category = require('../models/category');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, categoryId, options } = req.body;
    console.log('product', req.body);

    const product = await Product.create({ name, categoryId, options });
    const category = await Category.findById(categoryId);
    
    product.category = category;
    await product.save();

    return res.send({ product });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on post new product: ${e}` })
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    
    await Promise.all(products.map(async p => {
      const { options: prevOptions } = p;
      p.options = [];
      await Promise.all(prevOptions.map(async op => {
        const option = await Option.findById(op.id);
        if (option) {
          const { _id: id, name } = option;
          p.options.push({
            id,
            name,
            items: await Item.find({ _id: { $in: op.items } }).select('-options')
          });
        }
      }));
      return p;
    }));

    return res.send(products);
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` })
  }
});

router.get('/templates', async (req, res) => {
  try {
    const products = await Product.find().populate('templatesCategory');
    return res.send(products);
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` })
  }
});

module.exports = app => app.use('/products', router);

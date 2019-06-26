const express = require('express');

const Product = require('../models/product');
const Option = require('../models/option');
const Item = require('../models/item');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, options } = req.body;
    console.log('product', req.body);
    
    const product = await Product.create({ name, options });

    return res.send({ product });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on post new product: ${e}` })
  }

});

module.exports = app => app.use('/products', router);

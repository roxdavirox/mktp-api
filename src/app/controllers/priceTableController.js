const express = require('express');

const PriceTable = require('../models/priceTable');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, prices } = req.body;

    const priceTable = await PriceTable.create({ name, prices });

    return res.send({ priceTable });
  } catch(e) {
    return res.status(400)
      .send({ erro: `Error on post new price table: ${e}` })
  }

});

router.get('/', async (req, res) => {
  try {
    const priceTables = await PriceTable.find().populate('prices');

    return res.send({ priceTables });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}`});
  }
})

module.exports = app => app.use('/price-tables', router);

const express = require('express');

const PriceTable = require('../models/priceTable');
const Price = require('../models/price');

const router = express.Router();

const deletePricesByIds = async (req, res) => {
  try {
    const { priceTableIds } = req.body;

    await PriceTable.deleteMany({ _id: { $in: priceTableIds } });

    return res.send({ deletedCount: priceTableIds.length });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on delete price tables: ${e}`});
  }
};

const createPrice = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { price } = req.body;

    const priceTable = await PriceTable
      .findById(priceTableId).populate('prices');

    const p = await Price.create({ ...price, priceTable: priceTableId });
    
    priceTable.prices.push(p);

    await priceTable.save();

    return res.send({ price: p });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on update price table: ${e}`});
  }
};

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const priceTable = await PriceTable.create({ name });

    return res.send({ priceTable });
  } catch(e) {
    return res.status(400)
      .send({ erro: `Error on post new price table: ${e}` })
  }

});

router.get('/', async (req, res) => {
  try {
    const priceTables = await PriceTable.find().select('-prices');

    return res.send({ priceTables });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}`});
  }
});

router.get('/:priceTableId', async (req, res) => {
  try {
    const { priceTableId } = req.params;

    const priceTable = await PriceTable
      .findById(priceTableId)
      .populate('prices')
      .select('+prices');

    return res.send({ priceTable });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}`});
  }
});

router.delete('/', deletePricesByIds);
// usando put para criar child element
router.put('/:priceTableId', createPrice);

module.exports = app => app.use('/price-tables', router);

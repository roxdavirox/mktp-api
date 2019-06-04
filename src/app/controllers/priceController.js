const express = require('express');

const Price = require('../models/price');
const PriceTable = require('../models/priceTable');

const router = express.Router();

router.post('/:priceTableId', async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { prices } = req.body;

    const priceTable = await PriceTable.findById(priceTableId);

    await Promise.all(prices.map(async p => {
      const price = new Price({ ...p, priceTable: priceTableId });

      await price.save();

      priceTable.prices.push(price);
    }));

    await priceTable.save();

    return res.send({ priceTable });
  } catch(e) {
    return res.status(400)
      .send({ erro: `Error on post new price table: ${e}` })
  }

});

// router.get('/', async (req, res) => {
//   try {
//     const priceTables = await PriceTable.find();

//     return res.send({ priceTables });
//   } catch(e) {
//     return res.status(400)
//       .send({ error: `Error on get price tables: ${e}`});
//   }
// });

router.get('/:priceTableId', async (req, res) => {
  try {
    const { priceTableId } = req.params;

    const priceTable = await PriceTable
      .findById(priceTableId)
      .populate('prices')
      .select('+prices');

    const { prices } = priceTable;

    return res.send({ prices });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get prices: ${e}`});
  }
});

router.delete('/', async (req, res) => {
  try {
    const { priceIds } = req.body;

    await Price.deleteMany({ _id: { $in: priceIds } });

    return res.send({ deletedCount: priceIds.length });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on delete prices: ${e}`});
  }
});

router.put('/:priceTableId', async (req, res) => {
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
});

module.exports = app => app.use('/prices', router);

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

// router.delete('/', async (req, res) => {
//   try {
//     const { priceTableIds } = req.body;

//     await PriceTable.deleteMany({ _id: { $in: priceTableIds } });

//     return res.send({ deletedCount: priceTableIds.length });
//   } catch(e) {
//     return res.status(400)
//       .send({ error: `Error on delete price tables: ${e}`});
//   }
// });

// router.put('/:priceTableId', async (req, res) => {
//   try {
//     const { priceTableId } = req.params;
//     const { prices } = req.body;

//     const priceTable = await PriceTable.findById(priceTableId);
    
//     return res.send({ prices: priceTable.prices });
//   } catch(e) {
//     return res.status(400)
//       .send({ error: `Error on update price table: ${e}`});
//   }
// });

module.exports = app => app.use('/prices', router);

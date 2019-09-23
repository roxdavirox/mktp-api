/* eslint-disable no-underscore-dangle */
const express = require('express');

const Price = require('../models/price');
const PriceTable = require('../models/priceTable');

const router = express.Router();

const createPriceByPriceTableId = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { prices } = req.body;

    const priceTable = await PriceTable.findById(priceTableId);

    await Promise.all(prices.map(async (p) => {
      const price = new Price({
        ...p,
        priceTable: priceTableId,
      });

      await price.save();

      priceTable.prices.push(price);
    }));

    await priceTable.save();

    return res.send({ priceTable });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on post new price table: ${e}` });
  }
};

const generatePriceRange = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { prices, unit } = req.body;

    const priceTable = await PriceTable.findByIdAndUpdate(priceTableId, {
      unit,
    }, { new: true });
    priceTable.prices = [];

    await Promise.all(prices.map(async (p) => {
      const price = new Price({
        ...p,
        priceTable: priceTableId,
      });

      price.save();

      priceTable.prices.push(price);
    }));

    await priceTable.save();

    return res.send({ priceTable });
  } catch (e) {
    return res.status(400)
      .send({ error: 'Error on post price range into priceTable' });
  }
};

const updatePriceById = async (req, res) => {
  try {
    const { priceId } = req.params;

    const price = await Price.findByIdAndUpdate(priceId,
      { ...req.body },
      { new: true });

    return res.send({ price });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on update price: ${e}` });
  }
};

const getPricesByPriceTableId = async (req, res) => {
  try {
    const { priceTableId } = req.params;

    const priceTable = await PriceTable
      .findById(priceTableId)
      .populate('prices');

    return res.send({ priceTable });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get prices: ${e}` });
  }
};

const createLastPrice = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { price } = req.body;

    const prices = await Price
      .find({ priceTable: priceTableId })
      .sort({ _id: -1 })
      .limit(1);

    const [lastPrice] = prices;

    const newLastPrice = await Price
      .findByIdAndUpdate(
        lastPrice._id,
        { end: price.start - 0.0001 },
        { new: true },
      );

    const newPrice = await Price.create({ ...price, priceTable: priceTableId });

    const priceTable = await PriceTable.findById(priceTableId);
    priceTable.prices.push(newPrice);

    await priceTable.save();

    return res.send({ prices: [newLastPrice, newPrice] });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error when add last price: ${e}` });
  }
};

const deleteManyPrices = async (req, res) => {
  try {
    const { priceIds } = req.body;

    await Price.deleteMany({ _id: { $in: priceIds } });

    return res.send({ deletedCount: priceIds.length });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on delete prices: ${e}` });
  }
};

router.post('/:priceTableId', createPriceByPriceTableId);
router.post('/:priceTableId/range', generatePriceRange);
router.put('/:priceId', updatePriceById);
router.get('/:priceTableId', getPricesByPriceTableId);
router.post('/:priceTableId/last', createLastPrice);
router.delete('/', deleteManyPrices);

module.exports = (app) => app.use('/prices', router);

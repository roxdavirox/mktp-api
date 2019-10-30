/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('../../data');
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
    const { ObjectId } = mongoose.Types;
    const { priceId } = req.params;
    const { start, end, value } = req.body;

    if (start === null || end === null || value === null) {
      return res.status(400)
        .send({ error: 'Input null' });
    }

    // const price = await Price.findByIdAndUpdate(priceId,
    //   { ...req.body },
    //   { new: true });

    const priceTable = await PriceTable
      .findOne({ prices: { $in: new ObjectId(priceId) } })
      .populate('prices');

    const { prices } = priceTable;
    // TODO: atualizar preço e outros em volta preenchendo o vao
    const newPrices = [];
    let index = 0;
    if (end >= 1) {
      for (let i = 0; i < prices.length - 1; i++) {
        if (prices[i]._id.toString() === priceId && end < prices[i + 1].start) {
          index = i;
          prices[i].end = end;
          prices[i + 1].start = end + 0.0001;
          prices[i + 1].save();
          newPrices.push(prices[i + 1]);
          break;
        }
      }
    } 
    // else if (start >= 1) {
    //   for (let i = 0; i < prices.length - 1; i++) {
    //     if (prices[i]._id.toString() === priceId && prices[i - 1].end < start) {
    //       index = i;
    //       prices[i].start = start;
    //       prices[i].save();
    //       prices[i + 1].end = start - 0.0001;
    //       prices[i + 1].save();
    //       newPrices.push(prices[i + 1]);
    //       break;
    //     }
    //   }
    // }
    // eslint-disable-next-line no-plusplus

    await priceTable.save();

    return res.send({ price: prices[index], newPrices });
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
        { end: Number.isInteger(price.start) ? price.start : price.start - 0.0001 },
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

// quando deletar o sistema deve ajustar o vão que sobra entre os intervalos de preço
const deleteManyPrices = async (req, res) => {
  try {
    const { ObjectId } = mongoose.Types;
    const { priceIds } = req.body;
    const [priceId] = priceIds;

    await Price.deleteMany({ _id: { $in: priceIds } });

    const priceTable = await PriceTable
      .findOne({ prices: { $in: new ObjectId(priceId) } })
      .populate('prices');

    const { prices } = priceTable;

    const newPrices = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < prices.length - 1; i++) {
      // preenche vãos de intervalos após deletados
      if (prices[i].end + 0.0001 !== prices[i + 1].start || prices[i].end > prices[i + 1].start) {
        const averageValue = (prices[i].value + prices[i + 1].value) / 2;
        prices[i].value = averageValue || prices[i].value;
        prices[i].end = prices[i + 1].start - 0.0001;
        prices[i].save();
        newPrices.push(prices[i]);
      }
    }

    await priceTable.save();

    return res.send({ deletedCount: priceIds.length, newPrices });
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

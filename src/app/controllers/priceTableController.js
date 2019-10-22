const express = require('express');

const PriceTable = require('../models/priceTable');
const Price = require('../models/price');

const router = express.Router();

const createNewPriceTable = async (req, res) => {
  try {
    const { name, unit } = req.body;

    const priceTable = await PriceTable.create({ name, unit });

    return res.send({ priceTable });
  } catch (e) {
    return res.status(400)
      .send({ erro: `Error on post new price table: ${e}` });
  }
};

const getPriceValue = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { quantity, size: { x, y } } = req.body;
    const totalArea = quantity * x * y;

    const priceTable = await PriceTable.findById(priceTableId)
      .populate('prices');

    const { prices } = priceTable;
    const preco = prices.find((price) => (price.start <= totalArea && totalArea <= price.end));

    if (!preco) {
      const lastPrice = prices[prices.length - 1];
      const total = lastPrice.value * totalArea;
      return res.send({
        total,
      });
    }

    const total = preco.value * totalArea;

    return res.send({
      total,
    });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` });
  }
};

const getPriceTables = async (req, res) => {
  try {
    const priceTables = await PriceTable.find().select('-prices');

    return res.send({ priceTables });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` });
  }
};

const getPricesByPriceTableId = async (req, res) => {
  try {
    const { priceTableId } = req.params;

    const priceTable = await PriceTable
      .findById(priceTableId)
      .populate('prices')
      .select('+prices');

    return res.send({ priceTable });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get price tables: ${e}` });
  }
};

const deleteManyPriceTablesByIds = async (req, res) => {
  try {
    const { priceTableIds } = req.body;

    await PriceTable.deleteMany({ _id: { $in: priceTableIds } });

    return res.send({ deletedCount: priceTableIds.length });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on delete price tables: ${e}` });
  }
};

const createPriceTableChild = async (req, res) => {
  try {
    const { priceTableId } = req.params;
    const { price } = req.body;

    const priceTable = await PriceTable
      .findById(priceTableId).populate('prices');

    const p = await Price.create({ ...price, priceTable: priceTableId });

    priceTable.prices.push(p);

    await priceTable.save();

    return res.send({ price: p });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on update price table with new child: ${e}` });
  }
};

router.post('/', createNewPriceTable);
router.post('/total/:priceTableId', getPriceValue);
router.get('/', getPriceTables);
router.get('/:priceTableId', getPricesByPriceTableId);
router.delete('/', deleteManyPriceTablesByIds);
router.put('/:priceTableId', createPriceTableChild);

module.exports = (app) => app.use('/price-tables', router);

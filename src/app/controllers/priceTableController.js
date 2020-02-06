const express = require('express');

const PriceTable = require('../models/priceTable');
const PriceTableService = require('../services/priceTable');

const router = express.Router();

const priceTableController = {
  async createNewPriceTable(req, res) {
    try {
      const { name, unit } = req.body;
      const newPriceTable = { name, unit };
      const priceTable = await PriceTableService.createPriceTable(newPriceTable);
      return res.send({ priceTable });
    } catch (e) {
      return res.status(400)
        .send({ erro: `Error on post new price table: ${e}` });
    }
  },

  async calculatePriceByArea(req, res) {
    try {
      const { priceTableId } = req.params;
      const { quantity } = req.body;
      const { size = { x: 1, y: 1 } } = req.body;

      const total = await PriceTableService
        .getPriceAreaById(priceTableId, quantity, size);

      return res.send({ total });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get price tables: ${e}` });
    }
  },

  async getPriceTables(req, res) {
    try {
      const priceTables = await PriceTable.find().select('-prices');

      return res.send({ priceTables });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get price tables: ${e}` });
    }
  },

  async getPricesByPriceTableId(req, res) {
    try {
      const { priceTableId } = req.params;

      const priceTable = await PriceTableService
        .getPriceTableWithPricesById(priceTableId);

      return res.send({ priceTable });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get price tables: ${e}` });
    }
  },

  async deleteManyPriceTablesByIds(req, res) {
    try {
      const { priceTableIds } = req.body;

      const deletedCount = await PriceTableService
        .deleteManyPricesByIds(priceTableIds);

      return res.send({ deletedCount });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on delete price tables: ${e}` });
    }
  },

  async addNewPrice(req, res) {
    try {
      const { priceTableId } = req.params;
      const { price: p } = req.body;

      const price = await PriceTableService.addPrice(priceTableId, p);

      return res.send({ price });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on update price table with new child: ${e}` });
    }
  },
};

router.post('/', priceTableController.createNewPriceTable);
router.post('/total/:priceTableId', priceTableController.calculatePriceByArea);
router.get('/', priceTableController.getPriceTables);
router.get('/:priceTableId', priceTableController.getPricesByPriceTableId);
router.delete('/', priceTableController.deleteManyPriceTablesByIds);
router.put('/:priceTableId', priceTableController.addNewPrice);

module.exports = (app) => app.use('/price-tables', router);

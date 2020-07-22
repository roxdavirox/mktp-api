/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const Price = require('../models/price');
const PriceTable = require('../models/priceTable');
const PriceTableService = require('../services/priceTable.service');

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

  async calculateTotalByAreaAndId(req, res) {
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

  async calculatePriceByAreaAndId(req, res) {
    try {
      const { priceTableId } = req.params;
      const { area } = req.body;

      const price = await PriceTableService
        .getPriceIntervalByAreaAndId(priceTableId, area);

      return res.send({ price });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get price tables: ${e}` });
    }
  },

  async calculateManyAreasByIds(req, res) {
    try {
      const { priceTables } = req.body;
      if (!priceTables) return res.send({ error: 'priceTables not found' });

      const mapPriceTableAreas = await priceTables.map(async (pt) => {
        const price = await PriceTableService
          .getPriceIntervalByAreaAndId(pt.id, pt.area);

        return {
          unitPrice: price.value || 0,
          unit: pt.unit,
          id: pt.id,
          area: pt.area,
        };
      });

      const priceTablesWithAreas = await Promise.all(mapPriceTableAreas);
      const _priceTables = priceTablesWithAreas.reduce((obj, pt) => ({
        ...obj,
        [pt.id]: pt,
      }), {});

      return res.send({ priceTables: _priceTables });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error calculate tables areas: ${e}` });
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

  async updateName(req, res) {
    try {
      const { priceTableId } = req.params;
      const { name } = req.body;

      const priceTable = await PriceTableService
        .updateName(priceTableId, name);

      return res.send({ priceTable });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on update price table name: ${e}` });
    }
  },

  async duplicatePriceTable(req, res) {
    try {
      const { priceTableIds } = req.body;
      const priceTable = [];

      for (const priceTableId of priceTableIds) {
        const oldPriceTable = await PriceTable
          .findById(priceTableId).populate('prices');

        const newPriceTable = {
          name: `${oldPriceTable.name} - Cópia teste`,
          unit: oldPriceTable.unit,
        };

        const duplicatedPriceTable = await PriceTableService.duplicatePriceTable(newPriceTable);

        await Promise.all(oldPriceTable.prices.map(async (p) => {
          const price = new Price({
            start: p.start,
            end: p.end,
            value: p.value,
            priceTable: duplicatedPriceTable._id,
          });

          price.save();

          duplicatedPriceTable.prices.push(price);
        }));

        duplicatedPriceTable.save();
        priceTable.push(duplicatedPriceTable);
      }

      return res.send({ duplicatedPriceTable: priceTable });
    } catch (e) {
      return res.status(400)
        .send({ error: `Erro on duplicate price table: ${e}` });
    }
  },
};

router.post('/', priceTableController.createNewPriceTable);
router.post('/total/:priceTableId', priceTableController.calculateTotalByAreaAndId);
router.post('/price/:priceTableId', priceTableController.calculatePriceByAreaAndId);
router.post('/prices', priceTableController.calculateManyAreasByIds);
router.post('/duplicatePriceTable/', priceTableController.duplicatePriceTable);
router.get('/', priceTableController.getPriceTables);
router.get('/:priceTableId', priceTableController.getPricesByPriceTableId);
router.delete('/', priceTableController.deleteManyPriceTablesByIds);
router.put('/:priceTableId', priceTableController.addNewPrice);
router.put('/:priceTableId/name', priceTableController.updateName);

module.exports = (app) => app.use('/price-tables', router);

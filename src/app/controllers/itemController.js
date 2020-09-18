/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const ItemService = require('../services/item.service');
const Item = require('../models/item');

const router = express.Router();

const itemController = {
  async getItemByIdWithPrice(req, res) {
    try {
      const { itemId } = req.params;

      const item = ItemService.getItemPriceById(itemId);

      return res.send({ item });
    } catch (e) {
      return res.status(400)
        .send({ error: 'Error on load items' });
    }
  },

  async getItemById(req, res) {
    try {
      const { itemId } = req.params;

      const item = await ItemService.getItemById(itemId);

      return res.send({ item });
    } catch (e) {
      return res.status(400)
        .send({ error: 'Error on load items' });
    }
  },

  async deleteManyItemsByIds(req, res) {
    try {
      const { itemsId } = req.body;

      const deletedItemsCount = await ItemService.deleteManyItemsByIds(itemsId);

      return res.send({ deletedItemsCount });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on deleting item(s): ${e}` });
    }
  },

  async getTemplateItems(req, res) {
    try {
      const items = await ItemService.getAllItemsWithTemplates();

      return res.send({ items });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get items and templates ${e}` });
    }
  },

  async getAllItems(req, res) {
    try {
      const items = await ItemService.getAll();

      return res.send({ items });
    } catch (e) {
      return res.status(400)
        .send({ error: 'Error on load all items' });
    }
  },

  async updateItemById(req, res) {
    try {
      const { itemId } = req.params;

      const { name, priceTable, showUnitField } = req.body;
      const newItem = {
        name,
        priceTable:
        // eslint-disable-next-line eqeqeq
        priceTable == '0' ? undefined : priceTable,
        showUnitField,
      };

      const item = await ItemService
        .updateItem(itemId, priceTable, newItem);

      return res.send({ item });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on update item ${e}` });
    }
  },

  async createTemplateItem(req, res) {
    try {
      const { optionId } = req.params;

      const { name, templates, templateQuantity = 1 } = req.body;
      const newTemplateItem = {
        name,
        itemType: 'template',
        priceTable: undefined,
        templates,
        option: optionId,
        showUnitField: false,
        templateQuantity,
      };

      const templateItem = await ItemService.createTemplateItem(optionId, newTemplateItem);

      return res.send({ templateItem });
    } catch (err) {
      return res.status(400)
        .send({ error: 'Error when creating template item' });
    }
  },

  async createItemIntoOptions(req, res) {
    try {
      const { optionId } = req.params;

      const { name, priceTable, showUnitField } = req.body;
      const newItem = {
        name,
        itemType: 'item',
        showUnitField,
        priceTable:
        // eslint-disable-next-line eqeqeq
        priceTable == '0' ? undefined : priceTable,
        option: optionId,
      };

      const item = await ItemService.createItemIntoOption(optionId, newItem);

      return res.send({ item });
    } catch (err) {
      return res.status(400).send({ error: "Error on add option's item" });
    }
  },

  async createItemWithoutOption(req, res) {
    try {
      const { name, priceTable } = req.body;
      const newItem = {
        name,
        priceTable:
        // eslint-disable-next-line eqeqeq
        priceTable == '0' ? undefined : priceTable,
      };
      const item = await Item.create({ ...newItem });

      return res.send({ item });
    } catch (e) {
      return res.status(400)
        .send({ error: 'Error on creating a item' });
    }
  },

  async removeOptionsItemsWithoutDeleteFromDB(req, res) {
    try {
      const { optionId } = req.params;
      const { itemsId } = req.body;

      const deletedItemsCount = await ItemService
        .deleteItemsWithoutRemoveFromDB(optionId, itemsId);

      return res.send({ deletedItemsCount });
    } catch (e) {
      return res.status(400).send({ error: `Error on deleting option item(s): ${e}` });
    }
  },
};

router.post('/', itemController.createItemWithoutOption);
router.post('/:optionId', itemController.createItemIntoOptions);
router.post('/templates/:optionId', itemController.createTemplateItem);
router.post('/:itemId/price', itemController.getItemByIdWithPrice);
router.put('/:itemId', itemController.updateItemById);
router.get('/', itemController.getAllItems);
router.get('/templates', itemController.getTemplateItems);
router.get('/:itemId', itemController.getItemById);
router.delete('/', itemController.deleteManyItemsByIds);
// deleta os itens de uma opção, mas sem excluir do banco de dados
router.delete('/:optionId', itemController.removeOptionsItemsWithoutDeleteFromDB);

module.exports = (app) => app.use('/items', router);

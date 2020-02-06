/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const ItemService = require('../services/item');
const Item = require('../models/item');
const Option = require('../models/option');
const PriceTable = require('../models/priceTable');

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

      await Item.deleteMany({ _id: { $in: itemsId } });

      return res.send({ deletedItemsCount: itemsId.length });
    } catch (e) {
      return res.status(400).send({ error: `Error on deleting item(s): ${e}` });
    }
  },

  async getTemplateItems(req, res) {
    try {
      const items = await Item.find().populate({
        path: 'option',
      }).populate({
        path: 'priceTable',
        select: 'unit',
      }).populate({ path: 'templates.item' });

      // eslint-disable-next-line no-underscore-dangle
      const _items = await Promise.all(items.map(async (item) => {
        if (item.itemType === 'template' && item.templates) {
          const templatePrice = await item.templates
            .reduce(async (_total, _item) => await _total + await calculateItemPrice(_item), 0);
          return { ...item.toObject(), templatePrice };
        }
        return item;
      }));

      return res.send({ items: _items });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get items with price table ${e}` });
    }
  },

  async getAllItems(req, res) {
    try {
      const items = await Item.find();

      return res.send({ items });
    } catch (e) {
      return res.status(400).send({ error: 'Error on load all items' });
    }
  },

  async updateItemById(req, res) {
    try {
      const { itemId } = req.params;

      const { name, priceTable: priceTableId } = req.body;
      const newItem = {
        name,
        priceTable:
        // eslint-disable-next-line eqeqeq
        priceTableId == '0' ? undefined : priceTableId,
      };

      const priceTable = await PriceTable.findById(priceTableId);
      // eslint-disable-next-line eqeqeq
      if (priceTable.unit === 'quantidade') {
        await Item.update(
          { 'templates.item': itemId },
          {
            $set: { 'templates.$.size': { x: 1, y: 1 } },
          },
        );
      }

      const item = await Item
        .findByIdAndUpdate(
          itemId,
          { ...newItem },
          { new: true },
        );

      return res.send({ item });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on update item ${e}` });
    }
  },

  async createTemplateItem(req, res) {
    try {
      const { optionId } = req.params;

      const option = await Option.findById(optionId).populate('items');

      const { name, templates } = req.body;
      const templateItem = {
        name,
        itemType: 'template',
        priceTableId: undefined,
        templates,
        option: optionId,
      };

      const item = await Item.create({ ...templateItem });

      option.items.push(item);

      await option.save();

      const populatedItem = await Item.findById(item._id)
        .populate({
          path: 'option',
        }).populate({
          path: 'priceTable',
          select: 'unit',
        }).populate({ path: 'templates.item' });

      const templatePrice = await populatedItem.templates
        .reduce(async (_total, _item) => await _total + await calculateItemPrice(_item), 0);

      const templateItemWithPrice = { ...populatedItem.toObject(), templatePrice };

      return res.send({ templateItem: templateItemWithPrice });
    } catch (err) {
      return res.status(400).send({ error: 'Error when creating template item' });
    }
  },

  async createItemIntoOptions(req, res) {
    try {
      const { optionId } = req.params;

      const option = await Option.findById(optionId).populate('items');

      const { name, priceTableId } = req.body;
      const newItem = {
        name,
        itemType: 'item',
        priceTableId:
        // eslint-disable-next-line eqeqeq
        priceTableId == '0' ? undefined : priceTableId,
        option: optionId,
      };

      const item = await Item.create({ ...newItem });

      option.items.push(item);
      await option.save();

      return res.send({ item });
    } catch (err) {
      return res.status(400).send({ error: "Error on add option's item" });
    }
  },

  async createItemWithoutOption(req, res) {
    const { name, priceTableId } = req.body;

    try {
      const newItem = {
        name,
        priceTableId:
        // eslint-disable-next-line eqeqeq
        priceTableId == '0' ? undefined : priceTableId,
      };
      const item = await Item.create({ ...newItem });

      return res.send({ item });
    } catch (e) {
      return res.status(400).send({ error: 'Error on creating a item' });
    }
  },

  async removeOptionsItemsWithoutDeleteFromDB(req, res) {
    try {
      const { optionId } = req.params;

      const { itemsId } = req.body;

      const option = await Option.findById(optionId).populate(['items', 'items.templates']);

      if (itemsId) {
        itemsId.forEach((id) => {
          option.items.pull(id);
        });
        option.save();
        await Item.update(
          {},
          {
            $pull: { templates: { item: { $in: itemsId } } },
          },
          { multi: true },
        );
        await Item.deleteMany({ _id: { $in: itemsId } });
      }

      return res.send({ deletedItemsCount: itemsId.length });
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

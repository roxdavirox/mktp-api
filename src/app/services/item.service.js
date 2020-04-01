/* eslint-disable no-underscore-dangle */
const Item = require('../models/item');
const Price = require('../models/price');
const PriceTable = require('../models/priceTable');
const Option = require('../models/option');

// common functions - shared
async function calculateItemPrice(templateItem) {
  const { quantity, size = { x: 1, y: 1 } } = templateItem;
  if (!templateItem.item) return 0;
  const item = await Item.findById(templateItem.item._id)
    .populate({ path: 'templates.item' });

  const { priceTable, itemType } = item;
  let total = Number(size.x * size.y);

  if (itemType === 'template' && item.templates) {
    total *= Number(await Promise.resolve(
      item.templates
        .reduce(async (_total, _item) => await _total + await calculateItemPrice(_item), 0),
    ));
    return total;
  }

  const _price = await Price.findOne({
    priceTable,

    start: { $lte: total },
    end: { $gte: total },

  });

  if (!_price) {
    const prices = await Price
      .find({ priceTable })
      .sort({ _id: -1 })
      .limit(1);

    if (!prices) return 0;
    const [lastPrice] = prices;

    if (lastPrice) return 0;
    total *= lastPrice.value;

    return total * quantity;
  }

  total = Number(_price.value) * Number(total);
  return total * quantity;
}

async function groupPriceTableTemplateItems(item) {
  const _item = await Item.findById(item.id)
    .populate({ path: 'priceTable' })
    .populate({ path: 'templates.item' });

  if (_item.itemType === 'item' && _item.priceTable) {
    const { priceTable } = _item;
    return priceTable;
  }

  if (_item.itemType === 'template' && _item.templates) {
    const priceTables = await Promise.resolve(
      _item.templates.reduce(async (_priceTables, templateItem) => {
        const priceTable = await groupPriceTableTemplateItems(templateItem.item);
        if (priceTable.id === undefined) {
          console.log('_item undefined price table id', _item);
        }
        console.log('price table', priceTable);
        const { unit } = priceTable;
        return {
          ..._priceTables,
          [priceTable.id]: {
            id: priceTable.id.toString(),
            unit,
            area:
            unit !== 'quantidade'
              ? templateItem.size.x * templateItem.size.y * templateItem.quantity
              : templateItem.quantity,
            unitPrice: 0,
          },
        };
      }, {}),
    );
    return priceTables;
  }

  console.log('_item', _item);
  return {};
}

const itemService = {
  async getItemPriceById(id) {
    // TODO: Calcular o preço do item para o formulario no wp
    const item = await Item
      .findById(id)
      .populate('option')
      .populate({
        path: 'templates.item',
        populate: { path: 'priceTable', select: ' -prices' },
      })
      .populate({ path: 'templates.option' });

    if (item.itemType === 'template') {
      const templates = await Promise.all(item.templates.map(async (_item) => {
        const templatePrice = await calculateItemPrice(_item);
        return { ..._item.toObject(), templatePrice };
      }));

      return { ...item.toObject(), templates };
    }

    return item;
  },

  async getItemById(id) {
    const item = await Item
      .findById(id)
      .populate('option')
      .populate({
        path: 'templates.item',
        populate: { path: 'priceTable', select: ' -prices' },
      })
      .populate({ path: 'templates.option' });

    if (item.itemType === 'template') {
      const templates = await Promise.all(item.templates.map(async (_item) => {
        const templatePrice = await calculateItemPrice(_item);
        return { ..._item.toObject(), templatePrice };
      }));

      return { ...item.toObject(), templates };
    }

    return item;
  },

  async deleteManyItemsByIds(ids) {
    await Item.deleteMany({ _id: { $in: ids } });
    return ids.length;
  },

  async getAll() {
    return Item.find();
  },

  async getAllItemsWithTemplates() {
    const items = await Item.find().populate({
      path: 'option',
    }).populate({
      path: 'priceTable',
      select: 'unit',
    }).populate({ path: 'templates.item' });

    // eslint-disable-next-line no-underscore-dangle
    const _items = await Promise.all(items.map(async (item) => {
      if (item.itemType === 'template' && item.templates) {
        const priceTables = await groupPriceTableTemplateItems(item);
        console.log('priceTables', priceTables);
        return { ...item.toObject(), priceTables };
      }
      return item;
    }));

    return _items;
  },

  async getItemsByItemsId(itemsId) {
    const items = await Item.find({ _id: { $in: itemsId } }).populate({
      path: 'option',
    });
    return items;
  },

  async updateItem(itemId, priceTableId, newItem) {
    if (!priceTableId) {
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
    }

    const item = await Item
      .findByIdAndUpdate(
        itemId,
        { ...newItem },
        { new: true },
      );

    return item;
  },

  async createTemplateItem(optionId, templateItem) {
    const option = await Option.findById(optionId).populate('items');
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

    return templateItemWithPrice;
  },

  async createItemIntoOption(optionId, newItem) {
    const option = await Option.findById(optionId).populate('items');
    const item = await Item.create({ ...newItem });

    option.items.push(item);
    await option.save();
    return item;
  },

  async deleteItemsWithoutRemoveFromDB(optionId, itemsId) {
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
    return itemsId.length;
  },

};

module.exports = itemService;

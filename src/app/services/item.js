/* eslint-disable no-underscore-dangle */
const Item = require('../models/item');
const Price = require('../models/price');

// common functions
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

    const [lastPrice] = prices;
    total *= lastPrice.value;
    return total * quantity;
  }

  total = Number(_price.value) * Number(total);
  return total * quantity;
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
};

module.exports = itemService;

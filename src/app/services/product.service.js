/* eslint-disable no-underscore-dangle */

const ItemService = require('../services/item.service');
const PriceTableService = require('../services/priceTable.service');

const productService = {
  async getProductQuote(selectedItems, quantity, size) {
    const items = await Promise.all(selectedItems.map(async (_item) => {
      const item = await ItemService.getItemPriceById(_item._id);

      if (!item.priceTable) return { ...item.toObject(), price: 0 };

      const { priceTable } = item;

      const _quantity = quantity + (_item.quantity || 1);
      const _size = {
        x: size.x + (_item.size.x || 1),
        y: size.y + (_item.size.y || 1),
      };

      const price = await PriceTableService
        .getPriceAreaById(priceTable._id, _quantity, _size);

      return { ...item.toObject(), price };
    }));

    return items;
  },
};

module.exports = productService;

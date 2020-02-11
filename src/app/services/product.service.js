/* eslint-disable no-underscore-dangle */

const ItemService = require('../services/item');
const PriceTableService = require('../services/priceTable');

const productService = {
  async getProductQuote(itemsId, quantity, size) {
    const items = await Promise.all(itemsId.map(async (itemId) => {
      const item = await ItemService.getItemPriceById(itemId);
      if (!item.priceTable) return { ...item.toObject(), price: 0 };

      const { priceTable } = item;
      const price = await PriceTableService
        .getPriceAreaById(priceTable._id, quantity, size);
      return { ...item.toObject(), price };
    }));

    return items;
  },
};

module.exports = productService;

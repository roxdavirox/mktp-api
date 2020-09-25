/* eslint-disable no-underscore-dangle */

const ItemService = require('../services/item.service');

const productService = {
  async getProductQuote(selectedItems, quantity, size) {
    const items = await Promise.all(selectedItems.map(async (_item) => {
      const item = await ItemService.getItemAndPriceTableById(_item._id);

      if (!item.priceTable && item.itemType !== 'template') {
        return { ...item.toObject(), price: 0 };
      }

      let _size = size;
      let _quantity = quantity;

      if (item.itemType === 'template' || item.showUnitField) {
        _quantity = item.priceTable.unit === 'quantidade'
          ? Number((_item.quantity || 1))
          : Number(quantity) + Number((_item.quantity || 0));

        _size = {
          x: _item.size.x ? _item.size.x : 1,
          y: _item.size.y ? _item.size.y : 1,
        };
      }

      const price = await ItemService.calculateItemPrice({
        quantity: _quantity,
        size: _size,
        item,
      });

      return { ...item.toObject(), price };
    }));

    return items;
  },
};

module.exports = productService;

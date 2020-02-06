const PriceTable = require('../models/priceTable');

const priceTableService = {
  async getPriceAreaById(id, quantity, size) {
    const { _size = { x: 1, y: 1 } } = size;
    let total = quantity;

    const priceTable = await PriceTable.findById(id)
      .populate('prices');

    if (priceTable.unit !== 'quantidade') {
      total *= _size.x * _size.y;
    }

    const { prices } = priceTable;
    const preco = prices.find((price) => (price.start <= total && total <= price.end));

    if (!preco) {
      const lastPrice = prices[prices.length - 1];
      total *= lastPrice.value;
      return total;
    }

    total *= preco.value;

    return total;
  },
};

module.exports = priceTableService;

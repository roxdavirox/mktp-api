const PriceTable = require('../models/priceTable');
const Price = require('../models/price');
const Item = require('../models/item');

const priceTableService = {
  async getPriceAreaById(id, quantity, size = { x: 1, y: 1 }) {
    // const { _size = { x: 1, y: 1 } } = size;
    let total = quantity;

    const priceTable = await PriceTable.findById(id)
      .populate('prices');

    if (priceTable.unit !== 'quantidade') {
      total *= size.x * size.y;
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

  async getPriceIntervalByAreaAndId(id, area) {
    if (!area) return 0;

    const priceTable = await PriceTable.findById(id)
      .populate('prices');

    const { prices } = priceTable;
    const preco = prices.find((price) => (price.start <= area && area <= price.end));

    if (!preco) {
      const lastPrice = prices[prices.length - 1];
      return lastPrice;
    }

    return preco;
  },

  async getPriceTableWithPricesById(id) {
    return PriceTable
      .findById(id)
      .populate('prices')
      .select('+prices');
  },

  async addPrice(id, price) {
    const priceTable = await PriceTable
      .findById(id)
      .populate('prices');

    const p = await Price.create({ ...price, priceTable: id });
    priceTable.prices.push(p);

    await priceTable.save();
    return p;
  },

  async deleteManyPricesByIds(ids) {
    await PriceTable.deleteMany({ _id: { $in: ids } });
    await Item.update(
      { priceTable: { $in: ids } },
      {
        $set: { priceTable: undefined },
      },
      { multi: true },
    );
    return ids.length;
  },

  async createPriceTable(priceTable) {
    return PriceTable.create(priceTable);
  },

  async updateName(id, newName) {
    const priceTable = await PriceTable
      .findByIdAndUpdate(
        id,
        { name: newName },
        { new: true },
      ).select('-prices');

    return priceTable;
  },

  async duplicatePriceTable(newPriceTable) {
    const priceTable = await PriceTable
      .create(newPriceTable);

    return priceTable;
  }
};

module.exports = priceTableService;

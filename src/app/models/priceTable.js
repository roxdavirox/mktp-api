const mongoose = require('../../data');

const Schema = mongoose.Schema;

const PriceTableSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prices: [{
    type: Schema.Types.ObjectId,
    ref: 'Price',
    required: false,
    select: false,
  }],
  unit: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PriceTable = mongoose.model('PriceTable', PriceTableSchema);

module.exports = PriceTable;

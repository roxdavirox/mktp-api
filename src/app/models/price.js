const mongoose = require('../../data');

const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  minQuantity: {
    type: Number,
    required: true,
  },
  maxQuantity: {
    type: Number,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  priceTable: {
    type: Schema.Types.ObjectId,
    ref: 'PriceTable'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;

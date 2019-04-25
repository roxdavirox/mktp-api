const mongoose = require('../../data');

const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  minValue: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    required: true
  },
  minQuantity: {
    type: Number,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;

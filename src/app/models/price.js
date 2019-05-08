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

PriceSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

PriceSchema.set('toJSON', { virtuals: true });

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;

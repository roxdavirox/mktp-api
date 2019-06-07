const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  priceTable: {
    type: Schema.Types.ObjectId,
    ref: 'PriceTable',
    required: false,
  },
  options: [{
    type: Schema.Types.ObjectId,
    ref: 'Option'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

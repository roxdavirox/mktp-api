const mongoose = require('../../data');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  priceTableId: {
    type: Schema.Types.ObjectId,
    ref: 'PriceTable',
    required: false,
  },
  options: [{
    type: Schema.Types.ObjectId,
    ref: 'Option',
    select: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

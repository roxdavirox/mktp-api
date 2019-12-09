const mongoose = require('../../data')

const { Schema } = mongoose

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
  },
  priceTableId: {
    type: Schema.Types.ObjectId,
    ref: 'PriceTable',
    required: false,
  },
  option: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    select: true,
    required: true,
  },
  templates: [{
    option: {
      type: Schema.Types.ObjectId,
      ref: 'Option',
      required: true,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    size: { // medida
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item

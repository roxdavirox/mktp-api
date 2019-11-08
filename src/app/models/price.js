const mongoose = require( '../../data' )

const { Schema } = mongoose

const PriceSchema = new Schema( {
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  priceTable: {
    type: Schema.Types.ObjectId,
    ref: 'PriceTable',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
} )

const Price = mongoose.model( 'Price', PriceSchema )

module.exports = Price

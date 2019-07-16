const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ProductOptionSchema = new Schema({
  option: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: false,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: false
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductOption = mongoose.model('ProductOption', ProductOptionSchema);

module.exports = ProductOption;

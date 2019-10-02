const mongoose = require('../../data');

const { Schema } = mongoose;

const ProductTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  options: [{
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
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductOption = mongoose.model('ProductOption', ProductTemplateSchema);

module.exports = ProductOption;

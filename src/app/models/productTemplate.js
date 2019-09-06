const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ProductTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  psdUrl: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  templateCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TemplateCategory',
    required: false
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductTemplate = mongoose.model(
    'ProductTemplate',
    ProductTemplateSchema
  );

module.exports = ProductTemplate;

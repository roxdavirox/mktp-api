const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  templateCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TemplateCategory',
    required: false
  },
  options: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;

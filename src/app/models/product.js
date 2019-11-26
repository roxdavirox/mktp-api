const mongoose = require('../../data')

const { Schema } = mongoose

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  productOptions: [{ // usado para composição do produto
    option: {
      type: Schema.Types.ObjectId,
      ref: 'Option',
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  templatesCategory: [{
    type: Schema.Types.ObjectId,
    ref: 'TemplateCategory',
    required: false,
  }],
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product

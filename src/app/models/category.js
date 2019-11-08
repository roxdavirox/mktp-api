const mongoose = require( '../../data' )

const { Schema } = mongoose

const CategorySchema = new Schema( {
  name: {
    type: String,
    required: true,
  },
  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  }],
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
} )

const Category = mongoose.model( 'Category', CategorySchema )

module.exports = Category

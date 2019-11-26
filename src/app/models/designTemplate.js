const mongoose = require('../../data')

const { Schema } = mongoose

const DesignTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  psdUrl: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  templateCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TemplateCategory',
    required: false,
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
})

const DesignTemplate = mongoose.model(
  'DesignTemplate',
  DesignTemplateSchema,
)

module.exports = DesignTemplate

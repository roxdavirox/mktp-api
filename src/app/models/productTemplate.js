const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ProductTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stateId: {
    type: String,
    requierd: false
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

const mongoose = require('../../data');

const Schema = mongoose.Schema;

const TemplateSubCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stateId: {
    type: String,
    requierd: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TemplateSubCategory = mongoose.model(
    'TemplateSubCategory',
    TemplateSubCategorySchema
  );

module.exports = TemplateSubCategory;

const mongoose = require('../../data');

const Schema = mongoose.Schema;

const TemplateCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  templateSubCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TemplateSubCategory',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TemplateCategory = mongoose.model('TemplateCategory', TemplateCategorySchema);

module.exports = TemplateCategory;

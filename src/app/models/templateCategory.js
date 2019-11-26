const mongoose = require('../../data')

const { Schema } = mongoose

const TemplateCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  designTemplates: [{
    type: Schema.Types.ObjectId,
    ref: 'DesignTemplate',
    required: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const TemplateCategory = mongoose.model('TemplateCategory', TemplateCategorySchema)

module.exports = TemplateCategory

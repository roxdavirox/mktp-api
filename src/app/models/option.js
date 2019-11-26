const mongoose = require('../../data')

const { Schema } = mongoose

const OptionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Option = mongoose.model('Option', OptionSchema)

module.exports = Option

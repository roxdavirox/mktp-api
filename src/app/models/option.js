const mongoose = require('../../data');

const Schema = mongoose.Schema;

const OptionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }],
});

OptionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OptionSchema.set('toJSON', { virtuals: true });

const Option = mongoose.model('Option', OptionSchema);

module.exports = Option;

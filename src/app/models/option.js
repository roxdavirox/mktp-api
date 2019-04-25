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

const Option = mongoose.model('Option', OptionSchema);

module.exports = Option;

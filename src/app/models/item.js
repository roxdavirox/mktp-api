const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.ObjectId,
    ref: 'Price',
    required: false,
  },
  option: {
    type: Schema.Types.ObjectId,
    ref: 'Option'
  },
});

ItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ItemSchema.set('toJSON', { virtuals: true });

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

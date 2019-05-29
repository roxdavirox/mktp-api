const mongoose = require('../../data');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // price: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Price',
  //   required: false,
  // },
  options: [{
    type: Schema.Types.ObjectId,
    ref: 'Option'
  }],
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

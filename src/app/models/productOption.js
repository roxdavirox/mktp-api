const mongoose = require( '../../data' )

const { Schema } = mongoose

// schema utilizado para relacionar o produto com opções especificas já existentes

const ProductOptionSchema = new Schema({
  option: { // option possui seus próprios itens idependentes
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: false,
  },
  items: [{ // items utilizados pra compor o produto
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ProductOption = mongoose.model( 'ProductOption', ProductOptionSchema )

module.exports = ProductOption

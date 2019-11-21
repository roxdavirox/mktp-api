const express = require( 'express' )

const multer = require( 'multer' )
const Product = require( '../models/product' )
const ProductOption = require( '../models/productOption' )

const storage = multer.memoryStorage()
const upload = multer( { storage } )

const { productImageUpload } = require( '../../services/azureStorage' )

const router = express.Router()

const createProduct = async ( req, res ) => {
  try {
    const { name, categoryId, options: prevOptions } = req.body
    const { file } = req
    const newOptions = JSON.parse( prevOptions )
    const response = await productImageUpload( file )
    const { imageUrl } = response

    const product = await Product.create( {
      name,
      category: categoryId,
      imageUrl,
    } )

    await Promise.all( newOptions.map( async ( op ) => {
      const option = await ProductOption.create( {
        option: op.id,
        items: op.items,
      } )

      product.options.push( option )

      return option
    } ))

    await product.save()

    return res.send( { product } )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on post new product: ${e}` } )
  }
}

const getProducts = async ( req, res ) => {
  try {
    const products = await Product
      .find()
      .populate( [
        {
          path: 'templatesCategory',
          populate: {
            path: 'productTemplates',
          },
        },
        {
          path: 'options',
          populate: ['option', 'items'],
        },
      ] )

    return res.send( products )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on get products: ${e}` } )
  }
}

const getProductById = async ( req, res ) => {
  try {
    const { productId } = req.params
    const product = await Product
      .findById( productId )
      .populate( [
        {
          path: 'templatesCategory',
          populate: {
            path: 'productTemplates',
          },
        },
        {
          path: 'options',
          populate: ['option', 'items'],
        },
      ] )

    return res.send( product )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on get product by id: ${e}` } )
  }
}

const getAllTemplatesCategory = async ( req, res ) => {
  try {
    const products = await Product.find().populate( 'templatesCategory' )
    return res.send( products )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on get products: ${e}` } )
  }
}

const getHomeProducts = async ( req, res ) => {
  try {
    const fields = ['name', 'imageUrl', 'description', 'price']
    const products = await Product.find( {}, fields )
    return res.send( { products } )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on get products for home page: ${e}` } )
  }
}

const getProductDetailsByProductId = async ( req, res ) => {
  try {
    const { productId } = req.params
    const product = await Product
      .findById( productId )
      .populate( [
        {
          path: 'templatesCategory',
          populate: {
            path: 'designTemplates',
          },
        },
        {
          path: 'options',
          populate: ['items', 'option'],
        },
      ] )

    return res.send( { product } )
  } catch ( e ) {
    return res.status( 400 )
      .send( { error: `Error on get product details by id: ${e}` } )
  }
}

router.post( '/', upload.single( 'image' ), createProduct )
router.get( '/', getProducts )
router.get( '/templates', getAllTemplatesCategory )
router.get( '/:productId', getProductById )
router.get( '/home', getHomeProducts )
router.get( '/details/:productId', getProductDetailsByProductId )

module.exports = ( app ) => app.use( '/products', router )

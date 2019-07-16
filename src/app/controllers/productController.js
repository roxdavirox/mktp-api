const express = require('express');

const Product = require('../models/product');
const ProductOption = require('../models/productOption');
const Option = require('../models/option');
const Item = require('../models/item');
const Category = require('../models/category');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { uploadImage } = require('../../services/azureStorage');

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, categoryId, options: prevOptions } = req.body;
    const { file } = req;
    console.log('req.body', req.body);
    const newOptions = JSON.parse(prevOptions);
    console.log('newOptions', newOptions);

    const response = await uploadImage(file);
    const { imageUrl } = response;

    const product = await Product.create({ 
      name,
      category: categoryId,
      imageUrl
    });

    await Promise.all(newOptions.map(async op => {
      const option = await ProductOption.create({ 
          option: op.id,
          items: op.items 
        });

      product.options.push(option);

      return option;
    }));

    await product.save();

    return res.send({ product });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on post new product: ${e}` })
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    
    await Promise.all(products.map(async p => {
      const { options: prevOptions } = p;
      p.options = [];
      await Promise.all(prevOptions.map(async op => {
        const option = await Option.findById(op.id);
        if (option) {
          const { _id: id, name } = option;
          p.options.push({
            id,
            name,
            items: await Item.find({ _id: { $in: op.items } }).select('-options')
          });
        }
      }));
      return p;
    }));

    return res.send(products);
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` })
  }
});

router.get('/templates', async (req, res) => {
  try {
    const products = await Product.find().populate('templatesCategory');
    return res.send(products);
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` })
  }
});

router.get('/home', async (req, res) => {
  try {
    const fields = ['name', 'imageUrl', 'description', 'price'];
    const products = await Product.find({}, fields);
    return res.send({ products });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get products for home page: ${e}` })
  }
});

router.get('/details/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const fields = ['name', 'imageUrl', 'longDescription', 'price'];
    const product = await Product
      .findById(productId).populate([{
        path: 'templatesCategory', populate: {
          path: 'productTemplates'
        }
      }, { path: 'options', populate: {
        path: 'items'
      }}]);

    return res.send({ product });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get product details by id: ${e}` })
  }
});

module.exports = app => app.use('/products', router);

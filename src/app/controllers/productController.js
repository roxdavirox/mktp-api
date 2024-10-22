const express = require('express');
const multer = require('multer');
const Product = require('../models/product');
const { isTrue } = require('../../helpers/boolean');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { productImageUpload } = require('../../services/azureStorage');

const router = express.Router();
// TODO: encapsular services
const createProduct = async (req, res) => {
  try {
    const { name, categoryId, productOptions: _productOptions } = req.body;
    const { file } = req;
    const productOptions = JSON.parse(_productOptions);
    const response = await productImageUpload(file);
    const { imageUrl } = response;

    const product = await Product.create({
      name,
      category: categoryId,
      imageUrl,
      productOptions,
    });

    return res.send({ product });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on post new product: ${e}` });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name, categoryId, productOptions, isImageChanged = false, isImageDeleted = false,
    } = req.body;

    const newProduct = await Product.findByIdAndUpdate(req.params.productId, {
      name,
      category: categoryId,
      productOptions: JSON.parse(productOptions),
    }, { new: true });

    if (isTrue(isImageChanged)) {
      const { file } = req;
      const response = await productImageUpload(file);
      const { imageUrl } = response;
      newProduct.imageUrl = imageUrl;
      newProduct.save();
    }

    if (isTrue(isImageDeleted)) {
      newProduct.imageUrl = undefined;
      newProduct.save();
    }

    return res.send({ product: newProduct });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on post new product: ${e}` });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product
      .find()
      .populate([
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
      ]);

    return res.send(products);
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` });
  }
};

const getItemsByProductId = async (req, res) => {
  try {
    const product = await Product
      .findById(req.params.productId)
      .populate([
        {
          path: 'templatesCategory',
          populate: {
            path: 'productTemplates',
          },
        },
        {
          path: 'options',
          populate: ['option'],
        },
      ]);

    return res.send({ product });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product
      .findById(productId)
      .populate([
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
      ]);

    return res.send(product);
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product by id: ${e}` });
  }
};

const getAllTemplatesCategory = async (req, res) => {
  try {
    const products = await Product.find().populate('templatesCategory');
    return res.send(products);
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get products: ${e}` });
  }
};

const getHomeProducts = async (req, res) => {
  try {
    const fields = ['name', 'imageUrl', 'description', 'price'];
    const products = await Product.find({}, fields);
    return res.send({ products });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get products for home page: ${e}` });
  }
};

const getProductDetailsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product
      .findById(productId)
      .populate([
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
      ]);

    return res.send({ product });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product details by id: ${e}` });
  }
};

const deleteManyProductsByIds = async (req, res) => {
  try {
    const { productsId } = req.body;

    await Product.deleteMany({ _id: { $in: productsId } });

    return res.send({ deletedItemsCount: productsId.length });
  } catch (e) {
    return res.status(400).send({ error: `Error on deleting product(s): ${e}` });
  }
};

router.post('/', upload.single('image'), createProduct);
router.put('/:productId', upload.single('image'), updateProduct);
router.get('/', getProducts);
router.get('/:productId/items', getItemsByProductId);
router.get('/templates', getAllTemplatesCategory);
router.get('/:productId', getProductById);
router.get('/home', getHomeProducts);
router.get('/details/:productId', getProductDetailsByProductId);
router.delete('/', deleteManyProductsByIds);

module.exports = (app) => app.use('/products', router);

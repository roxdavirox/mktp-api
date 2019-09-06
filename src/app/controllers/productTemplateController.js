const express = require('express');

const mongoose = require('../../data');
const TemplateCategory = require('../models/templateCategory');
const ProductTemplate = require('../models/productTemplate');

const router = express.Router();

// utils for image upload
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { uploadImage } = require('../../services/azureStorage');

// faz upload da imagem e do PSD 
// salva o PSD no servidor do CC
// salva a imagem no servidor do azure
router.post('/:templateCategoryId', upload.any(), async (req, res) => {
  try {
    const { templateCategoryId } = req.params;
    console.log('templateCategoryId:', templateCategoryId);
    console.log('req files:', req.files);
    // const { name, stateId, imageUrl, productId } = req.body;

    // const templateCategory =
    //   await TemplateCategory.findById(templateCategoryId);

    // const productTemplate = await ProductTemplate.create({
    //   name,
    //   stateId,
    //   imageUrl,
    //   product: productId,
    //   templateCategory: templateCategoryId
    // });

    // templateCategory.productTemplates.push(productTemplate);
    // await templateCategory.save();

    // return res.send({ productTemplate });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on creating product category: ${e}`});
  }
});

router.get('/:templateCategoryId', async (req, res) => {
  try {
    const { templateCategoryId } = req.params;

    const templateCategory = await TemplateCategory
      .findById(templateCategoryId)
      .populate('productTemplates');

    return res.send({ productTemplates: templateCategory.productTemplates })
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get product template: ${e}`});
  }
});

router.get('/all/:productId', async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const { productId } = req.params;
    const productTemplates = await ProductTemplate
      .find({ product: { $in: new ObjectId(productId) } })
      .populate('product');

    return res.send({ productTemplates })
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get product template: ${e}`});
  }
});

router.get('/', async (req, res) => {
  try {
    const allProductTemplates = await ProductTemplate.find();

    return res.send({ productTemplates: allProductTemplates })
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get product template: ${e}`});
  }
});

module.exports = app => app.use('/product-templates', router);
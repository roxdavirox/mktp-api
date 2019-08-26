const express = require('express');

const mongoose = require('../../data');
const TemplateCategory = require('../models/templateCategory');
const ProductTemplate = require('../models/productTemplate');

const router = express.Router();

const createProductTemplate = async (req, res) => {
  try {
    const { templateCategoryId } = req.params;
    const { name, stateId, imageUrl, productId } = req.body;

    const templateCategory =
      await TemplateCategory.findById(templateCategoryId);

    const productTemplate = await ProductTemplate.create({
      name,
      stateId,
      imageUrl,
      product: productId,
      templateCategory: templateCategoryId
    });

    templateCategory.productTemplates.push(productTemplate);
    await templateCategory.save();

    return res.send({ productTemplate });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on creating product category: ${e}`});
  }
};

router.post('/:templateCategoryId', async (req, res) => {
  try {
    const allProductTemplates = await ProductTemplate.find();

    return res.send({ productTemplates: allProductTemplates })
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on get product template: ${e}`});
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

router.get('/', getAllProductTemplates);

module.exports = app => app.use('/product-templates', router);
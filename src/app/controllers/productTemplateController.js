const express = require('express');

const TemplateCategory = require('../models/templateCategory');
const ProductTemplate = require('../models/productTemplate');

const router = express.Router();

router.post('/:templateCategoryId', async (req, res) => {
  try {
    const { templateCategoryId } = req.params;
    const { stateId, imageUrl } = req.body;

    const templateCategory =
      await TemplateCategory.findById(templateCategoryId);

    const productTemplate = await ProductTemplate.create({
      name,
      stateId,
      imageUrl
    });

    templateCategory.productTemplates.push(productTemplate);
    await templateCategory.save();

    return res.send({ productTemplate });
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
const express = require('express');

const TemplateCategory = require('../models/templateCategory');
const ProductTemplate = require('../models/productTemplate');

const router = express.Router();

router.post('/:templateCategoryId', async (req, res) => {
  try {
    const { templateCategoryId } = req.params;
    const { stateId, imageUrl } = req.body;

    const templateCategory = await TemplateCategory.findById(templateCategoryId);
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

module.exports = app => app.use('/templates', router);
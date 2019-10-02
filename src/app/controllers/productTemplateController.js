const express = require('express');

const ProductTemplate = require('../models/productTemplate');

const router = express.Router();

const createProductTemplate = async (req, res) => {
  try {
    const { name, options } = req.body;
    const productTemplate = await ProductTemplate.create({ name, options });
    return res.send({ productTemplate });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error when creating a product template: ${e}` });
  }
};

const getAllProductTemplates = async (req, res) => {
  try {
    const productTemplates = await ProductTemplate.find();
    return res.send({ productTemplates });
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on product templates: ${e}` });
  }
};

router.post('/', createProductTemplate);
router.get('/', getAllProductTemplates);

module.exports = (app) => app.use('/product-templates', router);

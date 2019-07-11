const express = require('express');

const router = express.Router();

const TemplateCategory = require('../models/templateCategory');
const Product = require('../models/product');

const getAllTemplatesCategory = async (req, res) => {
  try {
    const templatesCategory = await TemplateCategory.find();
    return res.send({ templatesCategory });
  } catch(e) {
    return res.status(400)
    .send({ error: `Error when get all templates category ${e}`});
  }
};

const createTemplateCategory = async (req, res) => {
  try {
    console.log('post template category: ', req.body);
    const { productId } = req.params;
    const { name } = req.body;
    
    const product = await Product.findById(productId);
    const templateCategory = await TemplateCategory.create({ name });
    
    product.templatesCategory.push(templateCategory);
    
    await product.save();
    
    return res.send({ templateCategory });
  } catch(e) {
    return res.status(400)
    .send({ error: `Error on creating template category ${e}`});
  }
}

router.get('/', getAllTemplatesCategory);
router.post('/:productId', createTemplateCategory);

module.exports = app => app.use('/templates-category', router);
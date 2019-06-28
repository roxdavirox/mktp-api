const express = require('express');

const Category = require('../models/category');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    const category = await Category.create({ name, parentId: null });;

    if (subCategories) {
      await Promise.all(subCategories.map(async name => {
        const subCategory = new Category({ name, parentId: category._id});
        subCategory.save();
        category.subCategories.push(subCategory);
      }));

      await category.save();
    }

    return res.send({ category });
  } catch (e) {
    return res.status(400).send({ error: 'Error when creating category'});
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ parentId: null });

    return res.send({ categories });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load categories'});    
  }
});

module.exports = app => app.use('/categories', router);
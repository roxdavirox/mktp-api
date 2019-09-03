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

router.post('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await Category.findById(categoryId);
    const subCategory = await Category.create({ name, parentId: categoryId });
    category.subCategories.push(subCategory);

    await category.save();
    return res.send({ subCategory });
  } catch (e) {
    return res.status(400).send({ error: 'Error when creating category'});
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category
      .find({ parentId: null })
      .populate('subCategories');

    return res.send({ categories });
  } catch (e) {
    return res.status(400).send({ error: 'Error on load categories'});    
  }
});

router.delete('/', async (req, res) => {
  try {
    const { categoryIds } = req.body;

    await Category.deleteMany({ _id:{ $in: categoryIds }});

    return res.send({ deletedCount: categoryIds.length });
  } catch(e) {
    return res.status(400)
      .send({ error: `Error on deleting categories: ${e}`});
  }
});

module.exports = app => app.use('/categories', router);
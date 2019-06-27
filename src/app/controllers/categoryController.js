const express = require('express');

const Category = require('../models/category');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    const category = await Category.create({ name, parentId: null });;

    await Promise.all(subCategories.map(async name => {
      const subCategory = new Category({ name, parentId: category._id});
      subCategory.save();
      category.subCategories.push(subCategory);
    }));

    await category.save();
    return res.send({ category });
  } catch (e) {
    return res.status(400).send({ error: 'Error when creating category'});
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const options = await Option.find().populate('items');

//     return res.send({ options });
//   } catch (e) {
//     return res.status(400).send({ error: 'Error on load options'});    
//   }
// });

module.exports = app => app.use('/categories', router);
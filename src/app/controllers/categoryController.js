/* eslint-disable no-underscore-dangle */
const express = require('express')

const Category = require('../models/category')

const router = express.Router()

const createCategoryWithSubCategories = async (req, res) => {
  try {
    const { name, subCategories } = req.body

    const category = await Category.create({ name, parentId: null })

    if (subCategories) {
      await Promise.all(subCategories.map(async (subCategoryName) => {
        const subCategory = new Category({ name: subCategoryName, parentId: category._id })
        subCategory.save()
        category.subCategories.push(subCategory)
      }))

      await category.save()
    }

    return res.send({ category })
  } catch (e) {
    return res.status(400).send({ error: 'Error when creating category' })
  }
}

const createSubCategoryByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { name } = req.body

    const category = await Category.findById(categoryId)
    const subCategory = await Category.create({ name, parentId: categoryId })
    category.subCategories.push(subCategory)

    await category.save()
    return res.send({ subCategory })
  } catch (e) {
    return res.status(400).send({ error: 'Error when creating category' })
  }
}

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category
      .find({ parentId: null })
      .populate('subCategories')

    return res.send({ categories })
  } catch (e) {
    return res.status(400).send({ error: 'Error on load categories' })
  }
}

const deleteManyCategoriesByIds = async (req, res) => {
  try {
    const { categoryIds } = req.body

    await Category.deleteMany({ _id: { $in: categoryIds } })

    return res.send({ deletedCount: categoryIds.length })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on deleting categories: ${e}` })
  }
}

router.post('/', createCategoryWithSubCategories)
router.post('/:categoryId', createSubCategoryByCategoryId)
router.get('/', getAllCategories)
router.delete('/', deleteManyCategoriesByIds)

module.exports = (app) => app.use('/categories', router)

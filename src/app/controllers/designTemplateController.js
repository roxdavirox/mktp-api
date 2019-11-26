const express = require('express')

const multer = require('multer')
const mongoose = require('../../data')
const TemplateCategory = require('../models/templateCategory')
const DesignTemplate = require('../models/designTemplate')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })
const { templatePreviewUpload } = require('../../services/azureStorage')
const { uploadPsdToCustomerCanvas } = require('../../services/customerCanvas')

const uploadDesignTemplateFiles = async (req, res) => {
  try {
    const { templateCategoryId } = req.params
    const { name, productId } = req.body
    const [image, psd] = req.files

    const imgResponse = await templatePreviewUpload(image)

    const { imageUrl } = imgResponse
    // fazer request para o customer canvas enviando o psd
    const psdResponse = await uploadPsdToCustomerCanvas(psd)

    const { data: psdUrl } = psdResponse

    const templateCategory = await TemplateCategory.findById(templateCategoryId)

    const designTemplate = await DesignTemplate.create({
      name,
      imageUrl,
      psdUrl,
      product: productId,
      templateCategory: templateCategoryId,
    })

    templateCategory.designTemplates.push(designTemplate)
    await templateCategory.save()

    return res.send({ designTemplate })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on creating a product design template: ${e}` })
  }
}

const getDesignTemplatesByTemplateCategoryId = async (req, res) => {
  try {
    const { templateCategoryId } = req.params

    const templateCategory = await TemplateCategory
      .findById(templateCategoryId)
      .populate('designTemplates')

    return res.send({ designTemplates: templateCategory.designTemplates })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product design template: ${e}` })
  }
}

const getDesignTemplatesByProductId = async (req, res) => {
  try {
    const { ObjectId } = mongoose.Types
    const { productId } = req.params

    const designTemplates = await DesignTemplate
      .find({ product: { $in: new ObjectId(productId) } })
      .populate('product')

    return res.send({ designTemplates })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product design template: ${e}` })
  }
}

const getAllDesignTemplates = async (req, res) => {
  try {
    const designTemplates = await DesignTemplate.find()

    return res.send({ designTemplates })
  } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product design template: ${e}` })
  }
}

router.post('/:templateCategoryId', upload.any(), uploadDesignTemplateFiles)
router.get('/:templateCategoryId', getDesignTemplatesByTemplateCategoryId)
router.get('/all/:productId', getDesignTemplatesByProductId)
router.get('/', getAllDesignTemplates)

module.exports = (app) => app.use('/design-templates', router)

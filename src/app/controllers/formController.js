/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const Product = require('../models/product');

const PipedriveService = require('../services/pipedrive.service');
const ProductService = require('../services/product.service');

const router = express.Router();

const formController = {
  async getHtmlForm(req, res) {
    try {
      const {
          sizes,
          selectedItemsId,
          // quantity,
        } = req.body;

      const product = await Product
        .findById(req.params.productId)
        .populate([
          {
            path: 'templatesCategory',
            populate: {
              path: 'productTemplates',
            },
          },
          {
            path: 'productOptions.option',
          },
          {
            path: 'productOptions.item',
          },
        ]);

      const getUnique = (arr) => [...new Set(arr)];

      const optionsIds = product.productOptions.map((po) => po.option._id);
      const options = product.productOptions.map((po) => po.option);
      const uniqueOptions = getUnique(options)
        .reduce((all, op) => ({ ...all, [op._id]: op }), {});
      const uniqueOptionsIds = getUnique(optionsIds);

      const _options = {};
      uniqueOptionsIds.forEach((id) => {
        const items = product
          .productOptions
          .filter((po) => po.option._id === id)
          .map((po) => po.item);
        const option = { ...uniqueOptions[id].toObject() };

        _options[id] = { ...option, items };
      });

      const getHtmlString = (view, props) => new Promise((resolve, _) => {
        res.render(view, props, (err, html) => {
          if (err) _(err);
          resolve(html);
        });
      });

      const html = await getHtmlString('Form', {
        product,
        options: _options,
        sizes,
        selectedItemsId,
      });

      return res.send({ html });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get product form: ${e}` });
    }
  },

  async getQuote(req, res) {
    try {
      const { itemsId, quantity, size = { x: 1, y: 1 } } = req.body;

      const items = await ProductService.getProductQuote(itemsId, quantity, size);

      return res.send({ items });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get product quote: ${e}` });
    }
  },
  async createDeal(req, res) {
    const response = await PipedriveService.createDeal(req.body);
    return res.send({ response });
  },

};

router.post('/deal', formController.createDeal);
router.post('/quote', formController.getQuote);
router.post('/:productId', formController.getHtmlForm);

module.exports = (app) => app.use('/form', router);

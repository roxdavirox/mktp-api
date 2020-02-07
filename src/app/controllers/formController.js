/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const Product = require('../models/product');

const ItemService = require('../services/item');
const PriceTableService = require('../services/priceTable');

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

      const html = await getHtmlString('form', {
        product,
        options: _options,
        sizes,
        selectedItemsId,
      });

      return res.send({ html, price: 'R$ 200' });
    } catch (e) {
      return res.status(400)
        .send({ error: `Error on get product form: ${e}` });
    }
  },

  async getBudget(req, res) {
    try {
      const { itemsId, quantity, size } = req.body;
      const [itemId] = itemsId;

      const item = await ItemService.getItemPriceById(itemId);
      if (!item.priceTable) return res.send({ item, price: 0 });

      const { priceTable } = item;
      const price = await PriceTableService
        .getPriceAreaById(priceTable._id, quantity, size);

      return res.send({ item, price });
    } catch (e) {
    return res.status(400)
      .send({ error: `Error on get product form: ${e}` });
  }
  },
};

router.post('/budget', formController.getBudget);
router.post('/:productId', formController.getHtmlForm);

module.exports = (app) => app.use('/form', router);

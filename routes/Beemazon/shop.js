const express = require('express');
const shopController = require('../../controllers/Beemazon/shop');
const router = express.Router();

router.get('/products/item/:productId', shopController.getProduct);

router.get('/products/:category', shopController.getProductList);

router.get('/', shopController.getIndex);

module.exports = router;

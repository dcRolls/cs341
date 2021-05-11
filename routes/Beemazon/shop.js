const express = require('express');
const shopController = require('../../controllers/Beemazon/shop');
const router = express.Router();

router.get('/products/item/:productId', shopController.getProduct);

router.get('/products/:category', shopController.getProductList);

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

module.exports = router;

const express = require('express');
const shopController = require('../../controllers/Beemazon/shop');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/products/item/:productId', shopController.getProduct);

router.get('/products/:category', shopController.getProductList);

router.get('/', shopController.getIndex);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/update-cart', shopController.postCartUpdateQty);

router.post('/create-order', shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;

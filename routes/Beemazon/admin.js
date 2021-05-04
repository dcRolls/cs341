const express = require('express');
const adminController = require('../../controllers/Beemazon/admin');
const router = express.Router();

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

// // /admin/products => GET
// router.get('/products', adminController.getProducts);

// // /admin/add-product => POST
// 

// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;

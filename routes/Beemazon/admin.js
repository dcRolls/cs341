const express = require('express');
const adminController = require('../../controllers/Beemazon/admin');
const router = express.Router();
const isAuth = require('../../middleware/is-auth');
const { check, body } = require('express-validator/check');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', 
  [
    body('title', 'Title must be a string greater than 3 characters.')
      .isString()
      .isLength( {min: 3})
      .trim(),
    body('category', 'Category must be a string greater than 3 characters.')      
      .isString()
      .isLength({min: 3})
      .trim(),
    body('imageUrl', 'Image must be a file or url.')
      .isLength( {min: 5}),
    body('price', 'A valid numeric price is required.')
      .isFloat(),
    body('description', 'The product needs a valid description of at least 5 characters.')
      .isLength({ min: 5})
  ],
  isAuth, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', 
  [
    body('title', 'Title must be a string greater than 3 characters.')
      .isString()
      .isLength( {min: 3})
      .trim(),
    body('category', 'Category must be a string greater than 3 characters.')      
      .isString()
      .isLength({min: 3})
      .trim(),
    body('imageUrl', 'Image must be a file or url.')
      .isLength( {min: 5}),
    body('price', 'A valid numeric price is required.')
      .isFloat(),
    body('description', 'The product needs a valid description of at least 5 characters.')
      .isLength({ min: 5})
  ],
  isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;

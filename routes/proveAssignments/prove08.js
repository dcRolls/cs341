const express = require('express');
const controller = require('../../controllers/proveAssignments/prove08');

const router = express.Router();

router.get('/products', controller.getProducts);
router.get('/', controller.getPage);

module.exports = router;
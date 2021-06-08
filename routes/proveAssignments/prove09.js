const express = require('express');
const controller = require('../../controllers/proveAssignments/prove09');

const router = express.Router();

router.get('/pokemon', controller.getPokemon);
router.get('/', controller.getPage);

module.exports = router;